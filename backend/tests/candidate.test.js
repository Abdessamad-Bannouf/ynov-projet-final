const request = require("supertest");
const app = require("../index");            // <-- index.js exporte app
const prisma = require("../prisma/prisma");

const FRONT_ORIGIN = process.env.FRONT_ORIGIN || "http://localhost:5173";

// petit helper
function unwrap(payload) {
    return Array.isArray(payload) ? payload : (payload?.data ?? payload);
}

let agent;
let jwtToken;
let csrfToken;
let createdCandidateId;

beforeAll(async () => {
    agent = request.agent(app);

    // nettoyage large
    await prisma.feedback.deleteMany();
    await prisma.interview.deleteMany();
    await prisma.candidate.deleteMany({ where: { email: { contains: "@test.com" } } });
    await prisma.user.deleteMany({ where: { email: { contains: "@test.com" } } });

    // crée un user RH
    const bcrypt = require("bcryptjs");
    await prisma.user.create({
        data: {
            email: "rh@test.com",
            password: await bcrypt.hash("pass1234", 10),
            role: "rh",
        },
    });

    // login -> récup JWT
    const loginRes = await agent
        .post("/api/login")
        .set("Origin", FRONT_ORIGIN)
        .send({ email: "rh@test.com", password: "pass1234" });

    expect(loginRes.statusCode).toBe(200);
    jwtToken = loginRes.body.token;
    expect(jwtToken).toBeDefined();

    // csrf token
    const csrfRes = await agent
        .get("/api/csrf-token")               // <-- correspond à ton index.js
        .set("Origin", FRONT_ORIGIN);

    expect(csrfRes.statusCode).toBe(200);
    csrfToken = csrfRes.body.csrfToken;
    expect(csrfToken).toBeDefined();
});

afterAll(async () => {
    // nettoyage
    await prisma.feedback.deleteMany();
    await prisma.interview.deleteMany();
    await prisma.candidate.deleteMany({ where: { email: { contains: "@test.com" } } });
    await prisma.user.deleteMany({ where: { email: { contains: "@test.com" } } });
    await prisma.$disconnect();
});

describe("Candidates API", () => {
    it("crée un candidat (201)", async () => {
        const res = await agent
            .post("/api/candidates")
            .set("Origin", FRONT_ORIGIN)
            .set("X-CSRF-Token", csrfToken)
            .set("Authorization", `Bearer ${jwtToken}`)  // <-- header Bearer
            .send({
                name: "John Doe",
                email: "cand@test.com",
                experience: 3,
            });

        expect([200, 201]).toContain(res.statusCode);
        const body = unwrap(res.body);
        expect(body).toHaveProperty("id");
        createdCandidateId = body.id;
    });

    it("refuse un doublon d’email (409)", async () => {
        const res = await agent
            .post("/api/candidates")
            .set("Origin", FRONT_ORIGIN)
            .set("X-CSRF-Token", csrfToken)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({
                name: "Jane Dup",
                email: "cand@test.com",
                experience: 1,
            });

        expect(res.statusCode).toBe(409);
    });

    it("liste les candidats (200)", async () => {
        const res = await agent
            .get("/api/candidates?page=1&pageSize=10")
            .set("Origin", FRONT_ORIGIN)
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(res.statusCode).toBe(200);

        const payload = unwrap(res.body); // <- renvoie déjà body.data si présent
        expect(Array.isArray(payload)).toBe(true);

        // Si tu veux vérifier la pagination, lis-la sur res.body.pagination
        expect(res.body).toHaveProperty("pagination");
        expect(res.body.pagination).toHaveProperty("total");
    });

    it("récupère le détail du candidat (200)", async () => {
        const res = await agent
            .get(`/api/candidates/${createdCandidateId}`)
            .set("Origin", FRONT_ORIGIN)
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(res.statusCode).toBe(200);
        const cand = unwrap(res.body);
        expect(cand).toHaveProperty("id", createdCandidateId);
        expect(cand).toHaveProperty("email", "cand@test.com");
    });

    it("met à jour le candidat (200)", async () => {
        const res = await agent
            .put(`/api/candidates/${createdCandidateId}`)
            .set("Origin", FRONT_ORIGIN)
            .set("X-CSRF-Token", csrfToken)
            .set("Authorization", `Bearer ${jwtToken}`)
            .send({ experience: 5 });

        expect(res.statusCode).toBe(200);
        const cand = unwrap(res.body);
        expect(cand).toHaveProperty("experience", 5);
    });

    it("supprime le candidat (204)", async () => {
        const res = await agent
            .delete(`/api/candidates/${createdCandidateId}`)
            .set("Origin", FRONT_ORIGIN)
            .set("X-CSRF-Token", csrfToken)
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(res.statusCode).toBe(204);

        // Vérifie qu’il n’existe plus
        const res2 = await agent
            .get(`/api/candidates/${createdCandidateId}`)
            .set("Origin", FRONT_ORIGIN)
            .set("Authorization", `Bearer ${jwtToken}`);
        expect(res2.statusCode).toBe(404);
    });
});