// tests/auth.test.js
const request = require('supertest');
const app = require('../index');

describe("Auth API", () => {
    it("doit enregistrer un utilisateur (201 + token)", async () => {
        const email = `test+${Date.now()}@example.com`; // unique
        const res = await request(app)
            .post("/api/register")
            .send({ email, password: "password123", role: "rh" });

        if (res.statusCode !== 201) {
            console.error('REGISTER FAIL:', res.statusCode, res.body);
        }

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("token");
    });

    it("doit refuser un login incorrect (400 dans ton implémentation)", async () => {
        const res = await request(app)
            .post("/api/login")
            .send({ email: `wrong+${Date.now()}@example.com`, password: "badpass" });

        if (res.statusCode !== 400) {
            console.error('LOGIN NEGATIVE FAIL:', res.statusCode, res.body);
        }

        // Ton contrôleur renvoie 400 pour “Utilisateur non trouvé”
        expect(res.statusCode).toBe(400);
    });
});