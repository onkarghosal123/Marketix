import { Router } from "express";
import { register,sendOtp,login,getUser,logOut } from "../../controller/userController.js";
import { checkAuthUser } from "../../middleware/authUser.js";

const router = Router();
router.post("/register",register);
router.post("/send-otp",sendOtp)
router.post("/login",login)
router.get("/me", checkAuthUser, getUser);
router.post("/logout", logOut);

export default router;