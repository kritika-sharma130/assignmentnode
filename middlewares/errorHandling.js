export default function errorHandlingMiddlware(err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    return res.status(err.statusCode).json({ status: err.statusCode, error: err.message });
}