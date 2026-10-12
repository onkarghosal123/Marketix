import { createContext, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { setCartItems } from "../redux/cartSlice";

export const UserContext = createContext();

function UserProvider({ children }) {
    const dispatch = useDispatch();

    // Authentication states
    const [authUser, setAuthUser] = useState(null);
    const [otpSending, setOtpSending] = useState(false);
    const [isOtpsent, setIsOtpsent] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);

    // Product states
    const [allProducts, setAllProducts] = useState([]);
    const [isAllProductLoading, setIsAllProductLoading] = useState(false);
    const [product, setProduct] = useState(null);
    const [isProductLoading, setIsProductLoading] = useState(false);

    // Cart and total states
    const [isCartLoading, setIsCartLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState({
        subtotal: 0,
        discount: 0,
        deliveryCharge: 0,
        total: 0,
    });
    const [isTotalLoading, setIsTotalLoading] = useState(false);

    // Order states
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [isOrderLoading, setIsOrderLoading] = useState(false);

    // Get logged-in user
    const getUser = useCallback(async () => {
        try {
            const res = await axiosInstance.get("/user/auth/me");
            setAuthUser(res.data.user);
        } catch (error) {
            setAuthUser(null);
        }
    }, []);

    useEffect(() => {
        getUser();
    }, [getUser]);

    // Fetch cart items from the database
    const getCartItems = useCallback(async () => {
        setIsCartLoading(true);

        try {
            const res = await axiosInstance.get("/user/order/cart-items");
            dispatch(setCartItems(res.data.allCartItems));
            return res.data.allCartItems;
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to fetch cart"
            );
            return null;
        } finally {
            setIsCartLoading(false);
        }
    }, [dispatch]);

    // Fetch cart after authentication changes
    useEffect(() => {
        if (authUser) {
            getCartItems();
        } else {
            dispatch(setCartItems([]));
            setIsCartLoading(false);
        }
    }, [authUser, getCartItems, dispatch]);

    // Send OTP
    const sendOtp = async (data) => {
        try {
            setOtpSending(true);

            await axiosInstance.post("/user/auth/send-otp", data);

            setIsOtpsent(true);
            toast.success("OTP sent");
            return true;
        } catch (error) {
            console.log("Error in sendOtp:", error);
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
            return false;
        } finally {
            setOtpSending(false);
        }
    };

    // Login
    const login = async (data) => {
        try {
            setIsLoggingIn(true);

            const res = await axiosInstance.post("/user/auth/login", data);

            setAuthUser(res.data);
            toast.success("Logged in successfully");
            return true;
        } catch (error) {
            console.log("Login error:", error);
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
            return false;
        } finally {
            setIsLoggingIn(false);
        }
    };

    // Signup
    const signup = async (data) => {
        try {
            setIsSigningUp(true);

            await axiosInstance.post("/user/auth/register", data);

            toast.success("Signed up successfully");
            return true;
        } catch (error) {
            console.log("Signup error:", error);
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
            return false;
        } finally {
            setIsSigningUp(false);
        }
    };

    // Logout
    const logout = async () => {
        try {
            await axiosInstance.post("/user/auth/logout");

            setAuthUser(null);
            dispatch(setCartItems([]));
            setSelectedItems([]);
            setTotalPrice({
                subtotal: 0,
                discount: 0,
                deliveryCharge: 0,
                total: 0,
            });

            toast.success("Logged out successfully");
        } catch (error) {
            console.log("Logout error:", error);
            toast.error(
                error.response?.data?.message || "Logout failed"
            );
        }
    };

    // Get all products
    const getAllProducts = async () => {
        try {
            setIsAllProductLoading(true);

            const res = await axiosInstance.get(
                "/user/product/all-product"
            );

            setAllProducts(res.data.allProducts);
        } catch (error) {
            console.log("Error in getAllProducts:", error);
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setIsAllProductLoading(false);
        }
    };

    // Get product by seller product ID
    const getProductById = async (sellerproduct_id) => {
        try {
            setIsProductLoading(true);

            const res = await axiosInstance.get(
                `/user/product/${sellerproduct_id}`
            );

            setProduct(res.data.product);
        } catch (error) {
            console.log("Error in getProductById:", error);
            setProduct(null);
            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setIsProductLoading(false);
        }
    };

    // Calculate selected cart items total
    const getCartTotal = useCallback(async (cartItems) => {
        try {
            setIsTotalLoading(true);

            const res = await axiosInstance.post(
                "/user/order/get-total",
                { cartItems }
            );

            setSelectedItems(res.data.calculatedItems);
            setTotalPrice({
                subtotal: res.data.subtotal,
                discount: res.data.discount,
                deliveryCharge: res.data.deliveryCharge,
                total: res.data.total,
            });

            return res.data;
        } catch (error) {
            console.log("Error in getCartTotal:", error);

            setSelectedItems([]);
            setTotalPrice({
                subtotal: 0,
                discount: 0,
                deliveryCharge: 0,
                total: 0,
            });

            toast.error(
                error.response?.data?.message ||
                    "Failed to calculate total"
            );

            return null;
        } finally {
            setIsTotalLoading(false);
        }
    }, []);

    // Add item to cart
    const addCartItem = async (sellerproduct_id) => {
        try {
            await axiosInstance.post("/user/order/add-cart", {
                sellerproduct_id,
                quantity: 1,
            });

            await getCartItems();

            toast.success("Added to cart");
            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to add item"
            );
            return false;
        }
    };

    // Update cart item quantity
    const updateCartItemQuantity = async (sellerproduct_id, quantity) => {
        try {
            await axiosInstance.patch(
                `/user/order/cart-items/${sellerproduct_id}`,
                { quantity }
            );

            await getCartItems();
            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to update quantity"
            );
            return false;
        }
    };

    // Remove item from cart
    const removeCartItem = async (sellerproduct_id) => {
        try {
            await axiosInstance.delete(
                `/user/order/cart-items/${sellerproduct_id}`
            );

            await getCartItems();
            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to remove item"
            );
            return false;
        }
    };

    // Create order
    const createOrder = async (orderData) => {
        try {
            setIsPlacingOrder(true);

            const res = await axiosInstance.post(
                "/user/order/create-order",
                orderData
            );

            setOrderData(res.data);
            toast.success("Order placed successfully");
            return res.data;
        } catch (error) {
            console.log("Error in createOrder:", error);
            toast.error(
                error.response?.data?.message || "Failed to place order"
            );
            return null;
        } finally {
            setIsPlacingOrder(false);
        }
    };

    // Get user's orders
    const getMyOrders = async () => {
        try {
            setIsOrdersLoading(true);

            const res = await axiosInstance.get(
                "/user/order/my-orders"
            );

            setOrders(res.data.orders);
        } catch (error) {
            console.log("Error in getMyOrders:", error);
            toast.error(
                error.response?.data?.message || "Failed to load orders"
            );
        } finally {
            setIsOrdersLoading(false);
        }
    };

    // Get one order by ID
    const getOrderById = async (orderid) => {
        try {
            setIsOrderLoading(true);

            const res = await axiosInstance.get(
                `/user/order/${orderid}`
            );

            setOrder(res.data.order);
        } catch (error) {
            console.log("Error in getOrderById:", error);
            setOrder(null);
            toast.error(
                error.response?.data?.message || "Failed to fetch order"
            );
        } finally {
            setIsOrderLoading(false);
        }
    };

    // Context values
    const contextValue = {
        authUser,
        otpSending,
        isOtpsent,
        setIsOtpsent,
        isLoggingIn,
        isSigningUp,
        logout,
        login,
        signup,
        sendOtp,
        getUser,

        allProducts,
        isAllProductLoading,
        getAllProducts,
        product,
        isProductLoading,
        getProductById,

        isCartLoading,
        getCartItems,
        addCartItem,
        updateCartItemQuantity,
        removeCartItem,

        selectedItems,
        setSelectedItems,
        totalPrice,
        setTotalPrice,
        isTotalLoading,
        getCartTotal,

        isPlacingOrder,
        orderData,
        createOrder,
        orders,
        isOrdersLoading,
        getMyOrders,
        order,
        isOrderLoading,
        getOrderById,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider; 