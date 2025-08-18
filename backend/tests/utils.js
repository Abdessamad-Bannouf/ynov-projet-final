function unwrap(payload) {
    return payload?.data ?? payload;
}
module.exports = { unwrap };