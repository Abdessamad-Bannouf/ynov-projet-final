// backend/tests/jwt.unit.test.js
const jwt = require('jsonwebtoken');
const { signAuthToken } = require('../middlewares/auth'); // chemin RELATIF

test('signAuthToken retourne un JWT valide', () => {
    const token = signAuthToken({ id: 1, email: 'abdessamad.bannouf@laposte.net', role: 'rh' });
    const payload = jwt.decode(token);
    expect(payload.email).toBe('abdessamad.bannouf@laposte.net');
    expect(payload.role).toBe('rh');
});
