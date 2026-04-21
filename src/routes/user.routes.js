//  ==========================================
//              IMPORTACIONES
//  ==========================================
import { Router } from "express";
// Importaciones de controlador
import {
    createUser,
    getUsers,
    getUserById,
    getUserByDocument,
    updateUser,
    deleteUser,
    getMyPermissions
} from "../controllers/user.controller.js";

// <=== Importacion de middlewares ===>
import { validateToken } from "../middlewares/auth.middleware.js"; // validacion de token
import { checkPermission } from "../middlewares/checkPermission.middleware.js"; // validacion de permisos

const userRouter = Router();


//  ==========================================
//    MIDDLEWARE TOTAL DE VALIDACION DE JWT
//  ==========================================
userRouter.use(validateToken); // Aplicar validacion de JWT a todas las rutas de este router


//  ==========================================
//              RUTAS DISPONIBLES
//  ==========================================
userRouter.get("/", checkPermission(`user.get`), getUsers); // Obtener todos los usuarios

userRouter.get("/:id", checkPermission(`user.get`), getUserById); // Obtener un usuario específico por su ID

userRouter.get("/document/:document", checkPermission(`user.get`), getUserByDocument); // Obtener un usuario por documento

userRouter.get("/me/permissions", getMyPermissions); // Ruta para ver MIS propios permisos (Se realiza con el userId del JWT)

userRouter.post("/", checkPermission(`user.post`), createUser); // Registrar un nuevo usuario

userRouter.put("/:id", checkPermission(`user.put`), updateUser); // Actualizar los datos de un usuario existente

userRouter.delete("/:id", checkPermission(`user.delete`), deleteUser); // Eliminar un usuario del sistema


//  ==========================================
//         EXPORTACION DEL userRouter
//  ==========================================
export default userRouter;