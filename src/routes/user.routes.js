import { Router } from "express";
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controllers/user.controller.js";

const userRouter = Router();

// Obtener todos los usuarios
userRouter.get("/", getUsers);

// Obtener un usuario específico por su ID
userRouter.get("/:id", getUserById);

// Registrar un nuevo usuario
userRouter.post("/", createUser);

// Actualizar los datos de un usuario existente
userRouter.put("/:id", updateUser);

// Eliminar un usuario del sistema
userRouter.delete("/:id", deleteUser);

export default userRouter;