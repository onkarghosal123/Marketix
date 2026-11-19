import { Router } from "express";
import sellerAuthRoutes from "./Seller/sellerAuthRoutes.js"
import sellerFunctionRoutes from "./Seller/sellerFunctionRoutes.js"

const router = Router();
router.use("/auth",sellerAuthRoutes);
router.use("/functions",sellerFunctionRoutes)

export default router;