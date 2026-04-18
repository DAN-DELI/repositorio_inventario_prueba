import { UserModel } from "../models/user.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { successResponse } from "../utils/response.handler.js";
import bcrypt from 'bcryptjs';

// 1. Obtener todos los usuarios
const getUsers = catchAsync(async (req, res) => {
    const users = await UserModel.getAll();
    return successResponse(res, 200, "Lista de usuarios", users);
});

// 2. Obtener usuario por ID
const getUserById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const user = await UserModel.findById(Number(id));

    if (!user) {
        const error = new Error(`Usuario con ID ${id} no encontrado`);
        error.statusCode = 404;
        return next(error);
    }

    return successResponse(res, 200, "Usuario encontrado correctamente", user);
});

// 2.1 Obtener usuario por documento
const getUserByDocument = catchAsync(async (req, res, next) => {
    const { document } = req.params;
    const user = await UserModel.findByDocument(document);

    if (!user) {
        const error = new Error(`Usuario con documento ${document} no encontrado`);
        error.statusCode = 404;
        return next(error);
    }

    return successResponse(res, 200, "Usuario encontrado correctamente", user);
});

// 3. Crear usuario
const createUser = catchAsync(async (req, res, next) => {
    const { name, document, email, password } = req.body;

    // 1. Generar la "sal" (Nivel de seguridad 10)
    const salt = await bcrypt.genSalt(10);

    // 2. Crear el hash (encriptar la clave recibida) 
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Enviar al modelo la contraseña YA ENCRIPTADA
    const scriptUser = await UserModel.create({
        name,
        document,
        email,
        password: hashedPassword // Mandamos el hash, no la clave real
    });

    return successResponse(res, 201, "Usuario creado correctamente", scriptUser);
});

// 4. Actualizar usuario
const updateUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let { password, ...data } = req.body;

    // Si se proporciona password, encriptarla
    if (password) {
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        data = { ...data, password };
    }

    const updatedUser = await UserModel.update(Number(id), data);

    if (!updatedUser) {
        const error = new Error(`Usuario con ID ${id} no encontrado`);
        error.statusCode = 404;
        return next(error);
    }

    return successResponse(res, 200, "Usuario actualizado correctamente", updatedUser);
});

// 5. Eliminar usuario
const deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const isDeleted = await UserModel.delete(Number(id));

    if (!isDeleted) {
        const error = new Error(`No se pudo eliminar: Usuario con ID ${id} no encontrado`);
        error.statusCode = 404;
        return next(error);
    }

    return successResponse(res, 200, "Usuario eliminado correctamente");
});

export {
    createUser,
    getUsers,
    getUserById,
    getUserByDocument,
    updateUser,
    deleteUser
};
