//  ==========================================
//              IMPORTACIONES
//  ==========================================
import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory, // Controlador especial para la relación
} from "../controllers/category.controller.js";

// <=== Importacion de middlewares ===>
import { validateToken } from "../middlewares/auth.middleware.js"; // Validacion de JWT

// Validacion de datos con zod
import { validateSchema } from "../middlewares/validator.middleware.js";
import { categorySchema } from "../schemas/category.schema.js";

import { checkPermission } from "../middlewares/checkPermission.middleware.js"; // Validacion de permisos

const categoryRouter = Router();


//  ==========================================
//    MIDDLEWARE TOTAL DE VALIDACION DE JWT
//  ==========================================
categoryRouter.use(validateToken); // Aplicar validacion de JWT a todas las rutas de este router


//  ==========================================
//              RUTAS DISPONIBLES
//  ==========================================
categoryRouter.get("/", checkPermission("category.get"), getAllCategories); // Obtiene todas las categorias

categoryRouter.get("/:id", checkPermission("category.get"), getCategoryById); // Obtiene la categoria por su id

categoryRouter.get("/:id/products", checkPermission("category.get"), getProductsByCategory); // Obtiene productos por categoría

categoryRouter.post("/", checkPermission("category.post"), validateSchema(categorySchema), createCategory); // Crea una categoria

categoryRouter.put("/:id", checkPermission("category.put"), validateSchema(categorySchema), updateCategory); // Actualiza una categoria

categoryRouter.delete("/:id", checkPermission("category.delete"), deleteCategory); // Elimina una categoria


//  ==========================================
//       EXPORTACION DEL categoryRouter
//  ==========================================
export default categoryRouter;
