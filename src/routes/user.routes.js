import { Router } from "express";
import {
    createUser,
    getUsers,
    getUserById,
    getUserByDocument,
    updateUser,
    deleteUser
} from "../controllers/user.controller.js";

// middleware de validacion de token
import { validateToken } from "../middlewares/auth.middleware.js";
const userRouter = Router();

// Aplicar validacion de JWT a todas las rutas de este router
// userRouter.use(validateToken);

// Obtener todos los usuarios
userRouter.get("/", getUsers);

// Obtener un usuario específico por su ID
userRouter.get("/:id", getUserById);

// Obtener un usuario por documento
userRouter.get("/document/:document", getUserByDocument);

// Registrar un nuevo usuario
userRouter.post("/", createUser);

// Actualizar los datos de un usuario existente
userRouter.put("/:id", updateUser);

// Eliminar un usuario del sistema
userRouter.delete("/:id", deleteUser);

export default userRouter;