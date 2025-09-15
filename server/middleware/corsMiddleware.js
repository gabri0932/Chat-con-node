export function corsMiddleware(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');

        res.status(204).send();
        return;
    }

    next();
}