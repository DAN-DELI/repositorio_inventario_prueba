import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory, // Controlador especial para la relación
} from "../controllers/category.controller.js";

// middleware de validacion de JWT
import { validateToken } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { categorySchema } from "../schemas/category.schema.js";

const categoryRouter = Router();

// Aplicar validacion de JWT a todas las rutas de este router
categoryRouter.use(validateToken);

categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", getCategoryById);
categoryRouter.post("/", validateSchema(categorySchema), createCategory);
categoryRouter.put("/:id", validateSchema(categorySchema), updateCategory);
categoryRouter.delete("/:id", deleteCategory);

// Ruta Relacional: Obtener productos por categoría
// Sigue el estándar REST: /recurso-padre/:id/recurso-hijo
categoryRouter.get("/:id/products", getProductsByCategory);

export default categoryRouter;
