import { UserModel } from '../models/user.model.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * Middleware que valida si un usuario tiene un permiso específico.
 *
 * @param {string} requiredPermission - Permiso necesario (ej: 'user.get')
 * @returns {Function} Middleware de Express
 *
 * @requires validateToken - Debe ejecutarse antes (usa req.user.userId)
 *
 * @returns {void} Continúa con next() si tiene permiso, si no lanza error 403
 */
export const checkPermission = (requiredPermission) => {
    return catchAsync(async (req, res, next) => {

        // 1. Consultar los permisos del usuario
        const [rows] = await UserModel.getPermissiosUser(req.user.userId);
        const userPermissions = rows.map(p => p.action_name);

        // 2. Verificar si tiene el permiso requerido
        const hasPermission = userPermissions.some(
            perm => perm === requiredPermission
        );

        if (!hasPermission) {
            const error = new Error(`Acceso denegado: Se requiere el permiso '${requiredPermission}'`);
            error.statusCode = 403;
            return next(error);
        }

        // 3. Continuamos en el controlador.
        next();
    });
};