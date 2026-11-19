import { Router } from "express";
import { checkAuthUser } from "../../middleware/authUser.js";
import { allProduct,getProductById } from "../../controller/productController.js";

const router = Router();
// router.use(checkAuthUser);
router.get("/all-product",allProduct);
router.get("/:sellerproductid",getProductById);
export default router;