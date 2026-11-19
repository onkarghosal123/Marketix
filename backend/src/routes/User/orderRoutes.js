import { Router } from "express";
import {
    createOrder,
    myOrders,
    addToCart,
    getCartItems,
    getTotal,
    getOrderById,
    updateCartQuantity,
    removeCartItem
} from "../../controller/orderController.js";
import { checkAuthUser } from "../../middleware/authUser.js";

const router = Router();

router.use(checkAuthUser);

router.get("/cart-items", getCartItems);
router.post("/add-cart", addToCart);
router.patch("/cart-items/:sellerproduct_id", updateCartQuantity);
router.delete("/cart-items/:sellerproduct_id", removeCartItem);

router.post("/get-total", getTotal);
router.post("/create-order", createOrder);
router.get("/my-orders", myOrders);
router.get("/:orderid", getOrderById);

export default router;