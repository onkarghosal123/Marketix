import { Router } from "express";
import adminAuthRoutes from "./Admin/adminAuthRoutes.js"
import adminFunctionRoutes from "./Admin/adminFunctionRoutes.js"

const router = Router();
router.use("/auth",adminAuthRoutes)
router.use("/functions",adminFunctionRoutes)

export default router;