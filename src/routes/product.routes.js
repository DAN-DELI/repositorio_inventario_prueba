import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
// middleware de validacion de token
import { validateToken } from "../middlewares/auth.middleware.js";

// middleware de validacion de datos con zod
import { validateSchema } from "../middlewares/validator.middleware.js";
import { productSchema } from "../schemas/product.schema.js";

const productRouter = Router();

// Aplicar validacion de JWT a todas las rutas de este router
productRouter.use(validateToken);

productRouter.get("/", getAllProducts);

productRouter.get("/:id", getProductById);

productRouter.post("/", validateSchema(productSchema), createProduct);

productRouter.put("/:id", validateSchema(productSchema), updateProduct);

productRouter.delete("/:id", deleteProduct);

export default productRouter;