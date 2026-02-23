import { Router } from "express";
import { UserRole } from "../../generated/prisma";
import { getProduct, getProducts, createNewProduct, deleteProductById, updateProductById, searchProducts, getPaginatedProductsList, getProductBySlug } from "../controllers/product";
import { authenticate } from "../middlewares/auth";
import { requireRole } from "../middlewares/role";
import { validate } from "../middlewares/validate";
import { createProductSchema, updateProductSchema } from "../validators/product";
import { searchLimiter } from "../middlewares/rateLimiter";



const router = Router();

router.get('/search', searchLimiter, searchProducts);
router.get('/paginated', getPaginatedProductsList)
router.get("/slug/:slug", getProductBySlug);
router.get("/", getProducts)
router.get("/:id", getProduct);

router.post("/", authenticate, requireRole(UserRole.ADMIN), validate(createProductSchema), createNewProduct)
router.put("/:id", authenticate, requireRole(UserRole.ADMIN), validate(updateProductSchema), updateProductById);
router.delete("/:id", authenticate, requireRole(UserRole.ADMIN), deleteProductById);

export default router;