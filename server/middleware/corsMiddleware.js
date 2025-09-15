export function corsMiddleware(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        res.status(204).send();
        return;
    }

    next();
}