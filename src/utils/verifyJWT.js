import jwt from 'jsonwebtoken';

export const verifyJWT = (token, secret) => {
    try {
        return { valid: true, decoded: jwt.verify(token, secret) };
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return {
                valid: false,
                message: 'Acceso denegado: El token ha expirado, inicie sesión nuevamente'
            };
        }
        return {
            valid: false,
            message: 'Acceso denegado: Token inválido'
        };
    };
};