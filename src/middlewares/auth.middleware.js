import jwt from 'jsonwebtoken';
import { verifyJWT } from '../utils/verifyJWT.js';
import { catchAsync } from '../utils/catchAsync.js';
import "dotenv/config";

export const validateToken = catchAsync(async (req, res, next) => {
    let token;

    // 1. Obtener token del header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 2. Si no hay token
    if (!token) {
        const error = new Error('Acceso denegado: Token requerido');
        error.statusCode = 401;
        return next(error);
    }

    // 3. Verificar token
    const result = verifyJWT(token, process.env.JWT_SECRET);

    if (!result.valid) {
        const error = new Error(result.message);
        error.statusCode = 401;
        return next(error);
    }

    const decoded = result.decoded;

    // 4. Verificar que sea tipo access
    if (decoded.type !== 'access') {
        const error = new Error('Acceso denegado: Token inválido');
        error.statusCode = 401;
        return next(error);
    }

    // 5. Adjuntar usuario al request
    req.user = {
        userId: decoded.userId,
        email: decoded.email,
        document: decoded.document
    };

    // 6. Permitir acceso
    next();
});
