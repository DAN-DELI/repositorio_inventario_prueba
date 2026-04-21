//  ==========================================
//              IMPORTACIONES
//  ==========================================
import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

// <=== Importacion de middlewares ===>
import { validateToken } from "../middlewares/auth.middleware.js"; // Validacion de token

// Validacion de datos con zod
import { validateSchema } from "../middlewares/validator.middleware.js";
import { productSchema } from "../schemas/product.schema.js";

import { checkPermission } from "../middlewares/checkPermission.middleware.js"; // Validacion de permisos

const productRouter = Router();

//  ==========================================
//    MIDDLEWARE TOTAL DE VALIDACION DE JWT
//  ==========================================
productRouter.use(validateToken); // Aplicar validacion de JWT a todas las rutas de este router


//  ==========================================
//              RUTAS DISPONIBLES
//  ==========================================
productRouter.get("/", checkPermission("product.get"), getAllProducts); // Obtener todos los productos

productRouter.get("/:id", checkPermission("product.get"), getProductById); // Obtener producto por id

productRouter.post("/", checkPermission("product.post"), validateSchema(productSchema), createProduct); // Crear producto

productRouter.put("/:id", checkPermission("product.put"), validateSchema(productSchema), updateProduct); // Actualizar producto

productRouter.delete("/:id", checkPermission("product.delete"), deleteProduct); // Borrar producto


//  ==========================================
//       EXPORTACION DEL productRouter
//  ==========================================
export default productRouter;