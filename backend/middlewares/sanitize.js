const sanitizeHtml = require('sanitize-html');

function deepSanitize(value) {
    if (typeof value === 'string') {
        return sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {},
            disallowedTagsMode: 'discard',
        });
    }
    if (Array.isArray(value)) return value.map(deepSanitize);
    if (value && typeof value === 'object') {
        const out = {};
        for (const k of Object.keys(value)) out[k] = deepSanitize(value[k]);
        return out;
    }
    return value;
}

module.exports = function sanitizeAll(req, _res, next) {
    req.body = deepSanitize(req.body);
    req.query = deepSanitize(req.query);
    req.params = deepSanitize(req.params);
    next();
};
