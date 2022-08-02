import authService from '../services/authService.js';

export default function authMiddleware() {
    const handleAuthentication = (req, res, next) => {
        let idToken;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            idToken = req.headers.authorization.split(" ")[1];
        }

        if (!idToken) {
            const error = new Error("id token is empty");
            error.statusCode = 401;
            return next(error);
        }

        const decoded = authService().validateToken(idToken);
        if (decoded.error) {
            const error = new Error(decoded.error);
            error.statusCode = 401;
            return next(error);
        }

        req.context = {
            "userId": decoded.token.userId
        };

        next();
    };

    return {
        handleAuthentication
    };
}