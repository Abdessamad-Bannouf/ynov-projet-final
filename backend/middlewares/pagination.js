module.exports = (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    let pageSize = parseInt(req.query.limit) || 10;

    // Limitation de données à afficher sur une page (limit)
    const maxPageSize = 20;
    if (pageSize > maxPageSize) {
        pageSize = maxPageSize;
    }

    const skip = (page - 1) * pageSize;

    req.pagination = { page, pageSize, skip };

    next();
};
