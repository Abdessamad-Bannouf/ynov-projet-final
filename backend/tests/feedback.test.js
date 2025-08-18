const request = require('supertest');
const app = require('../index');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const FRONT_ORIGIN = 'http://localhost:5173';
const unwrap = (p) => (p?.data ?? p);

describe('Feedbacks API', () => {
    const agent = request.agent(app);

    let csrfToken;
    let jwt;

    let userEmail;
    let reviewerId;

    let candidateEmail;
    let candidateId;

    let interview; // objet interview
    let feedback;  // objet feedback

    beforeAll(async () => {
        // 1) Register RH
        userEmail = `rh_${Date.now()}@test.com`;
        const pass = 'pass12345';

        const reg = await agent
            .post('/api/register')
            .set('Origin', FRONT_ORIGIN)
            .send({ email: userEmail, password: pass, role: 'rh' });
        expect([200, 201]).toContain(reg.statusCode);

        // 2) Login RH
        const login = await agent
            .post('/api/login')
            .set('Origin', FRONT_ORIGIN)
            .send({ email: userEmail, password: pass });
        expect(login.statusCode).toBe(200);

        jwt = login.body.token;
        expect(jwt).toBeTruthy();

        const u = await prisma.user.findUnique({ where: { email: userEmail } });
        reviewerId = u?.id;
        expect(reviewerId).toBeTruthy();

        // 3) CSRF token
        const csrf = await agent.get('/api/csrf-token').set('Origin', FRONT_ORIGIN);
        expect(csrf.statusCode).toBe(200);
        csrfToken = csrf.body.csrfToken;

        // 4) Seed candidate
        candidateEmail = `candi_${Date.now()}@test.com`;
        const cand = await prisma.candidate.create({
            data: { name: 'Candi Test', email: candidateEmail, experience: 1 },
        });
        candidateId = cand.id;

        // 5) Create interview (protégé + CSRF)
        const iso = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        const resInt = await agent
            .post('/api/interviews')
            .set('Origin', FRONT_ORIGIN)
            .set('Authorization', `Bearer ${jwt}`)
            .set('X-CSRF-Token', csrfToken)
            .send({
                date: iso,
                location: 'Salle A',
                candidateId,
                recruiterId: reviewerId,
            });

        if (![200, 201].includes(resInt.statusCode)) {
            // eslint-disable-next-line no-console
            console.error('CREATE INTERVIEW FAIL:', resInt.statusCode, resInt.body);
        }

        expect([200, 201]).toContain(resInt.statusCode);
        interview = unwrap(resInt.body);
        expect(interview).toHaveProperty('id');
    });

    afterAll(async () => {
        try {
            if (interview?.id) {
                await prisma.feedback.deleteMany({ where: { interviewId: interview.id } });
                await prisma.interview.deleteMany({ where: { id: interview.id } });
            }
            if (candidateEmail) {
                await prisma.candidate.deleteMany({ where: { email: candidateEmail } });
            }
            if (userEmail) {
                await prisma.user.deleteMany({ where: { email: userEmail } });
            }
        } finally {
            await prisma.$disconnect();
        }
    });

    test('crée un feedback (201) puis l’obtient via GET /feedbacks/interviews/:interviewId', async () => {
        // Create feedback (JWT + CSRF)
        const create = await agent
            .post('/api/feedbacks')
            .set('Origin', FRONT_ORIGIN)
            .set('Authorization', `Bearer ${jwt}`)
            .set('X-CSRF-Token', csrfToken)
            .send({
                interviewId: interview.id,
                reviewerId,
                comments: 'Très bon candidat',
            });

        expect([200, 201]).toContain(create.statusCode);
        feedback = unwrap(create.body);
        expect(feedback).toHaveProperty('id');

        // GET list by interview — ⚠️ route protégée (requireAuth sur le préfixe feedbacks)
        const list = await agent
            .get(`/api/feedbacks/interviews/${interview.id}`)
            .set('Origin', FRONT_ORIGIN)
            .set('Authorization', `Bearer ${jwt}`);

        expect(list.statusCode).toBe(200);

        const payload = unwrap(list.body);
        const arr = Array.isArray(payload) ? payload : payload.data || [];
        expect(Array.isArray(arr)).toBe(true);
        expect(arr.some((f) => f.id === feedback.id)).toBe(true);
    });

    test('empêche un doublon de feedback du même reviewer sur le même entretien (409)', async () => {
        const dup = await agent
            .post('/api/feedbacks')
            .set('Origin', FRONT_ORIGIN)
            .set('Authorization', `Bearer ${jwt}`)
            .set('X-CSRF-Token', csrfToken)
            .send({
                interviewId: interview.id,
                reviewerId,
                comments: 'Second feedback',
            });

        expect([409, 400]).toContain(dup.statusCode);
    });

    test('met à jour un feedback (PUT /feedbacks/:id) (200)', async () => {
        const upd = await agent
            .put(`/api/feedbacks/${feedback.id}`)
            .set('Origin', FRONT_ORIGIN)
            .set('Authorization', `Bearer ${jwt}`)
            .set('X-CSRF-Token', csrfToken)
            .send({ comments: 'Mise à jour du commentaire' });

        expect(upd.statusCode).toBe(200);
        const updated = unwrap(upd.body);
        expect(updated.comments).toMatch(/Mise à jour/);
    });

    test('supprime un feedback (DELETE /feedbacks/:id) (204) puis n’apparaît plus dans la liste', async () => {
        const del = await agent
            .delete(`/api/feedbacks/${feedback.id}`)
            .set('Origin', FRONT_ORIGIN)
            .set('Authorization', `Bearer ${jwt}`)
            .set('X-CSRF-Token', csrfToken);

        expect([200, 204]).toContain(del.statusCode);

        // Re-liste (JWT requis)
        const list = await agent
            .get(`/api/feedbacks/interviews/${interview.id}`)
            .set('Origin', FRONT_ORIGIN)
            .set('Authorization', `Bearer ${jwt}`);

        expect(list.statusCode).toBe(200);
        const payload = unwrap(list.body);
        const arr = Array.isArray(payload) ? payload : payload.data || [];
        expect(arr.some((f) => f.id === feedback.id)).toBe(false);
    });
});