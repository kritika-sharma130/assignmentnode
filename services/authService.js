import config from '../config/config.js';
import jsonwebtoken from 'jsonwebtoken';

export default function authService() {
    const jwtSecretKey = config.tokenKey;

    const createToken = (user) => {
        let data = {
            userId: user._id,
            name: user.name,
            email: user.email,
            time: Date()
        };
        let expire = {
            expiresIn: "2h"
        };

        return jsonwebtoken.sign(data, jwtSecretKey, expire);
    };

    const validateToken = (idToken) => {
        let token;
        try {
            token = jsonwebtoken.verify(idToken, jwtSecretKey);
        } catch (err) {
            return { "error": "invalid token" };
        };

        return { "token": token };

    }

    return {
        createToken,
        validateToken
    };
}
