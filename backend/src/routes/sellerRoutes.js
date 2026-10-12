import { Router } from "express";
import sellerAuthRoutes from "./seller/sellerAuthRoutes.js"
import sellerFunctionRoutes from "./seller/sellerFunctionRoutes.js"

const router = Router();
router.use("/auth",sellerAuthRoutes);
router.use("/functions",sellerFunctionRoutes)

export default router;