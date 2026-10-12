import { Router } from "express";
import adminAuthRoutes from "./admin/adminAuthRoutes.js"
import adminFunctionRoutes from "./admin/adminFunctionRoutes.js"

const router = Router();
router.use("/auth",adminAuthRoutes)
router.use("/functions",adminFunctionRoutes)

export default router;