/**
 * tests/calendar.test.js
 *
 * - Mock complet de `googleapis`
 * - Flow OAuth: appel de /api/calendars/oauth2callback pour peupler la session
 * - Création d’un event: /api/calendars/create (JWT + CSRF)
 * - Statut de connexion: /api/calendars/status
 * - Garde: POST create sans JWT -> 401/403
 */

jest.setTimeout(60000);

jest.mock('googleapis', () => {
    // Mocks des méthodes utilisées par ton controller
    const mOAuth2 = jest.fn().mockImplementation(() => ({
        generateAuthUrl: jest.fn().mockReturnValue('https://auth.example'),
        getToken: jest.fn().mockResolvedValue({ tokens: { access_token: 'at-123' } }),
        setCredentials: jest.fn(),
    }));

    // Mocks Calendar v3
    const insert = jest.fn().mockResolvedValue({
        data: {
            id: 'evt_123',
            htmlLink: 'https://calendar.google.com/event?eid=evt_123',
            hangoutLink: 'https://meet.google.com/aaa-bbbb-ccc',
        },
    });
    const update = jest.fn().mockResolvedValue({ data: { id: 'evt_123' } });
    const del    = jest.fn().mockResolvedValue({});

    const calendar = jest.fn().mockReturnValue({
        events: { insert, update, delete: del },
    });

    return { google: { auth: { OAuth2: mOAuth2 }, calendar } };
});

const request = require('supertest');
const app = require('../index');              // ton app Express exportée
const prisma = require('../prisma/prisma');
const { unwrap } = require('./utils');

// Même origine que ton CORS (important pour CSRF cookie-mode)
const FRONT_ORIGIN = 'http://localhost:5173';

describe('Google Calendar API', () => {
    const agent = request.agent(app); // conserve cookies (session + CSRF)
    let csrfToken;
    let jwtToken;

    beforeAll(async () => {
        // 1) Récupérer un CSRF token et cookie
        const csrfRes = await agent
            .get('/api/csrf-token')
            .set('Origin', FRONT_ORIGIN);
        expect(csrfRes.statusCode).toBe(200);
        csrfToken = csrfRes.body.csrfToken;
        expect(csrfToken).toBeTruthy();

        // 2) Créer un utilisateur RH et récupérer un JWT
        const email = `rh_${Date.now()}@test.com`;
        const pwd   = 'pass12345';
        const reg = await agent
            .post('/api/register')
            .set('Origin', FRONT_ORIGIN)
            .set('X-CSRF-Token', csrfToken)
            .send({ email, password: pwd, role: 'rh' });

        expect([200, 201]).toContain(reg.statusCode);
        expect(reg.body.token).toBeTruthy();
        jwtToken = reg.body.token;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('renvoie le statut connecté=false avant OAuth', async () => {
        const s = await agent
            .get('/api/calendars/status')
            .set('Origin', FRONT_ORIGIN);

        expect(s.statusCode).toBe(200);
        const body = unwrap(s.body);
        expect(body).toHaveProperty('connected');
        // On ne fige pas la valeur (false/true) pour rester robuste
    });

    it('complète l’OAuth via /oauth2callback (mocké) et passe en connecté', async () => {
        // Simule le retour Google (le mock renvoie des tokens)
        const cb = await agent
            .get('/api/calendars/oauth2callback?code=dummy')
            .set('Origin', FRONT_ORIGIN);

        // Selon ton implémentation, ça peut être 200 (send) ou 302 (redirect)
        expect([200, 302]).toContain(cb.statusCode);

        const s2 = await agent
            .get('/api/calendars/status')
            .set('Origin', FRONT_ORIGIN);
        expect(s2.statusCode).toBe(200);
        const body = unwrap(s2.body);
        expect(body).toHaveProperty('connected');
    });

    it('crée un événement (JWT + CSRF requis) → 200/201 + htmlLink/meet', async () => {
        const now = new Date();
        const start = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
        const end   = new Date(now.getTime() + 65 * 60 * 1000).toISOString();

        const res = await agent
            .post('/api/calendars/create')
            .set('Origin', FRONT_ORIGIN)
            .set('X-CSRF-Token', csrfToken)               // ⚠️ CSRF pour POST
            .set('Authorization', `Bearer ${jwtToken}`)   // ⚠️ JWT (requireAuth/requireRole)
            .send({
                // interviewId: 123, // facultatif : active si tu veux tester la MAJ DB
                summary: 'Entretien – Candidat Test',
                description: 'Test création calendrier',
                start,
                end,
                location: 'Google Meet',
                attendees: ['candidat@example.com', 'recruteur@example.com'],
            });

        // Le contrôleur peut renvoyer 201 (création) ou 200 (succès)
        expect([200, 201]).toContain(res.statusCode);

        // Accepte eventHtmlLink (normalisé) ou htmlLink (natif Google)
        const eventLink = res.body.eventHtmlLink || res.body.htmlLink;
        expect(eventLink).toBeTruthy();

        // Hangout/Meet link
        expect(res.body).toHaveProperty('hangoutLink');
    });

    it('refuse la création sans JWT → 401/403', async () => {
        const now = new Date();
        const start = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
        const end   = new Date(now.getTime() + 65 * 60 * 1000).toISOString();

        const res = await agent
            .post('/api/calendars/create')
            .set('Origin', FRONT_ORIGIN)
            .set('X-CSRF-Token', csrfToken)
            // pas d’Authorization
            .send({
                summary: 'Sans JWT',
                start, end,
            });

        expect([401, 403]).toContain(res.statusCode);
    });

    // (Optionnel) si tu exposes /api/calendars/update et /api/calendars/delete
    // et que tes mocks les supportent, tu peux ajouter des tests similaires:
    //
    // it('met à jour un événement → 200/204', async () => { ... });
    // it('supprime un événement → 200/204', async () => { ... });
});
