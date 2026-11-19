import { Router } from "express";
import authRoutes from "./User/authRoutes.js";
import orderRoutes from "./User/orderRoutes.js";
import productRoutes from "./User/productRoutes.js";


const router = Router();
router.use("/auth",authRoutes);
router.use("/order",orderRoutes);
router.use("/product",productRoutes)

export default router;