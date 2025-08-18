const request = require('supertest');
const app = require('../index');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const FRONT_ORIGIN = 'http://localhost:5173';
const unwrap = (p) => (p?.data ?? p);

describe('Interviews API', () => {
    const agent = request.agent(app);

    let csrfToken;
    let jwt;

    let userEmail;
    let userId;

    let candidateEmail;
    let candidateId;

    let createdInterviewId;

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
        userId = u?.id;
        expect(userId).toBeTruthy();

        // 3) CSRF token
        const csrf = await agent.get('/api/csrf-token').set('Origin', FRONT_ORIGIN);
        expect(csrf.statusCode).toBe(200);
        csrfToken = csrf.body.csrfToken;
        expect(csrfToken).toBeTruthy();

        // 4) Seed candidate
        candidateEmail = `candi_${Date.now()}@test.com`;
        const cand = await prisma.candidate.create({
            data: { name: 'Candi Test', email: candidateEmail, experience: 1 },
        });
        candidateId = cand.id;
    });

    afterAll(async () => {
        try {
            if (createdInterviewId) {
                await prisma.feedback.deleteMany({ where: { interviewId: createdInterviewId } });
                await prisma.interview.deleteMany({ where: { id: createdInterviewId } });
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

    test('doit créer un entretien avec un token CSRF + JWT valides', async () => {
        const iso = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        const res = await agent
            .post('/api/interviews')
            .set('Origin', FRONT_ORIGIN)
            .set('Authorization', `Bearer ${jwt}`)
            .set('X-CSRF-Token', csrfToken)
            .send({
                date: iso,
                location: 'Salle A',
                candidateId,
                recruiterId: userId,
            });

        if (![200, 201].includes(res.statusCode)) {
            // aide debug
            // eslint-disable-next-line no-console
            console.error('CREATE INTERVIEW FAIL:', res.statusCode, res.body);
        }

        expect([200, 201]).toContain(res.statusCode);
        const body = unwrap(res.body);
        expect(body).toHaveProperty('id');
        createdInterviewId = body.id;
        expect(body.candidateId ?? body.candidate?.id).toBe(candidateId);
        expect(body.recruiterId ?? body.recruiter?.id).toBe(userId);
    });
});
