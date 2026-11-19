import { Router } from "express";
import { sellerRegister,sellerSendOtp, sellerLogin,getSeller,sellerLogout } from "../../controller/sellerController/sellerAuthController.js";
import { checkAuthSeller } from "../../middleware/authSeller.js";

const router = Router();

router.post("/register", sellerRegister);
router.post("/send-otp", sellerSendOtp);
router.post("/login", sellerLogin);
router.get("/me", checkAuthSeller, getSeller);
router.post("/logout", sellerLogout);

export default router;