import { Router } from "express";
import { getAllProduct, addPrice, updatePrice, getSellerProduct, getAllOrderItems, updateOrderItemStatus,sellerDashboard,updateSellerApplication } from "../../controller/sellerController/sellerFunctionController.js";
import {checkAuthSeller} from "../../middleware/authSeller.js"

const router = Router();
router.use(checkAuthSeller);

router.get("/all-product", getAllProduct);
router.post("/add-price", addPrice);
router.get("/seller-product", getSellerProduct);
router.post("/update-price", updatePrice);
router.get("/all-order-items", getAllOrderItems);
router.post("/update-orderitem-status", updateOrderItemStatus);
router.get("/dashboard", sellerDashboard);
router.patch("/update-application", updateSellerApplication);


export default router;