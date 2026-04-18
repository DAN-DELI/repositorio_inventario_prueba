import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { UserModel } from "../models/user.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { errorResponse, successResponse } from "../utils/response.handler.js";
import { verifyJWT } from "../utils/verifyJWT.js";

// Configuración de tiempos de expiración
const ACCESS_TOKEN_EXPIRY = '15m';    // 15 minutos
const REFRESH_TOKEN_EXPIRY = '1d';    // 1 día


// ====================================================
//                    1. LOGIN
// ====================================================
export const loginJWT = catchAsync(async (req, res, next) => {
    const { document, password } = req.body;

    // 1. Buscar usuario
    const user = await UserModel.findByDocument(document);

    // Si no existe, creamos un error personalizado y lo enviamos al middleware
    if (!user) {
        const error = new Error(`No se encontro al usuario con documento ${document}`);
        error.statusCode = 401;
        return next(error);
    }

    // 2. Validar password
    const isValid = await bcrypt.compare(password, user.password);

    // Si no es valida, creamos un error personalizado y lo enviamos al middleware
    if (!isValid) {
        const error = new Error(`Credenciales invalidas`);
        error.statusCode = 401;
        return next(error);
    }

    // 3. Generar tokens
    const accessToken = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            document: user.document,
            type: 'access'
        },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
        {
            userId: user.id,
            type: 'refresh'
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // 4. Guardar refresh en BD
    await UserModel.updateRefreshToken(user.id, refreshToken);

    // 5. Empaquetar informacion
    const responseData = {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            document: user.document,
            email: user.email
        }
    };

    // 6. Responder
    successResponse(res, 200, "JWT creado con exito", responseData);
});

// ====================================================
//               2. REFRESH TOKEN
// ====================================================
export const refreshJWT = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;

    // 1. Validar que venga el token
    if (!refreshToken) {
        const error = new Error("Acceso denegado: Token requerido");
        error.statusCode = 401;
        return next(error);
    }

    const result = verifyJWT(refreshToken, process.env.JWT_REFRESH_SECRET)

    if (!result.valid) {
        const error = new Error(result.message);
        error.statusCode = 401;
        return next(error);
    }

    const decoded = result.decoded;

    // 3. Verificar que sea tipo refresh
    if (decoded.type !== 'refresh') {
        const error = new Error("Acceso denegado: Token inválido");
        error.statusCode = 401;
        return next(error);
    }

    // 4. Buscar usuario y validar que el token coincida con BD
    const user = await UserModel.findByRefreshToken(refreshToken);

    if (!user) {
        const error = new Error("Acceso denegado: Token inválido o revocado");
        error.statusCode = 401;
        return next(error);
    }

    // 5. Renovacion de tokens
    const accessToken = jwt.sign(
        {
            userId: user.id,
            email: user.email,
            document: user.document,
            type: 'access'
        },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const newRefreshToken = jwt.sign(
        {
            userId: user.id,
            type: 'refresh'
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    // 6. Actualizar refresh token en BD (invalida el anterior)
    await UserModel.updateRefreshToken(user.id, newRefreshToken);

    // 7. Empaquetar informacion
    const responseData = {
        accessToken,
        refreshToken: newRefreshToken,
        user: {
            id: user.id,
            name: user.name,
            document: user.document,
            email: user.email
        }
    };

    successResponse(res, 200, "Token renovado exitosamente", responseData);
});

// ====================================================
//                    3. LOGOUT
// ====================================================
export const logout = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;

    // Validacion de que envio el token
    if (!refreshToken) {
        const error = new Error("Refresh token requerido");
        error.statusCode = 400
        return next(error);
    }

    // Buscar usuario por refresh token
    const user = await UserModel.findByRefreshToken(refreshToken);

    if (!user) {
        const error = new Error("No se encontro usuario asociado");
        error.statusCode = 404;
        return next(error)
    }
    // Revocar el token
    await UserModel.revokeRefreshToken(user.id);

    successResponse(res, 200, "Sesión cerrada exitosamente")
});