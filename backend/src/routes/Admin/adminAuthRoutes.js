import { Router } from "express";
import { adminSendOtp, adminLogin, getAdmin, logoutAdmin} from "../../controller/adminController/adminAuthController.js";
import { checkAuthAdmin } from "../../middleware/authAdmin.js";

const router = Router();
router.post("/send-otp", adminSendOtp);
router.post("/login", adminLogin);
router.get("/me", checkAuthAdmin, getAdmin);
router.post("/logout", logoutAdmin);
export default router;