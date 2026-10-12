import { Router } from "express";
import { allOrder, addProductDetails, allProducts, adminGetOrderById, allSellerProducts, allUser, allSeller,getSellerById,updateSellerStatus, dashboard } from "../../controller/adminController/adminFunctionController.js";
import { checkAuthAdmin } from "../../middleware/authAdmin.js";


const router = Router();
router.use(checkAuthAdmin);
router.post("/add-product", addProductDetails);
router.get("/all-product", allProducts)
router.get("/all-sellerproduct", allSellerProducts)
router.get("/all-order", allOrder);
router.get("/order/:orderid", adminGetOrderById)
router.get("/all-user", allUser);  //to do
router.get("/all-seller", allSeller); //to do
router.get("/dashboard", dashboard);
router.get("/:sellerId", getSellerById);
router.patch("/:sellerId/status", updateSellerStatus);



export default router;