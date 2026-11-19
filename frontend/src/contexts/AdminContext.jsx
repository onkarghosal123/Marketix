import { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const AdminContext = createContext();

function AdminProvider({ children }) {
    const [otpSending, setOtpSending] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [isSellerDetailsLoading, setIsSellerDetailsLoading] = useState(false);
    const [isUpdatingSellerStatus, setIsUpdatingSellerStatus] = useState(false);
    const [isAdminLoading, setIsAdminLoading] = useState(true);
    const [dashboardState, setDashboardState] = useState("dashboard");
    const [dashboardData, setDashboardData] = useState(null);
    const [isDashboardLoading, setIsDashboardLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [isProductsLoading, setIsProductsLoading] = useState(false);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [orders, setOrders] = useState([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isOrderDetailsLoading, setIsOrderDetailsLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [sellers, setSellers] = useState([]);
    const [isSellersLoading, setIsSellersLoading] = useState(false);
    const [sellerProducts, setSellerProducts] = useState([]);
    const [isSellerProductsLoading, setIsSellerProductsLoading] = useState(false);

    useEffect(() => {
        getAdmin();
    }, []);
    const getAdmin = async () => {
        try {
            const res = await axiosInstance.get(
                "/admin/auth/me"
            );
            setAdmin(res.data.admin);

        } catch (error) {
            setAdmin(null);

        } finally {
            setIsAdminLoading(false);
        }
    };
    const sendOtp = async (data) => {

        try {

            setOtpSending(true);

            const res = await axiosInstance.post(
                "/admin/auth/send-otp",
                data
            );


            toast.success("OTP sent");

            return true;

        } catch (error) {

            console.log(
                "Send OTP error:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to send OTP"
            );

            return false;

        } finally {

            setOtpSending(false);
        }
    };
    const login = async (data) => {

        try {

            setIsLoggingIn(true);

            console.log("Login data:", data);

            const res = await axiosInstance.post(
                "/admin/auth/login",
                data
            );

            console.log("Login response:", res.data);

            setAdmin(res.data.user);

            toast.success("Logged in successfully");

            return true;

        } catch (error) {

            console.log(
                "Login error:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                "Login failed"
            );

            return false;

        } finally {

            setIsLoggingIn(false);
        }
    };
    const logout = async () => {
        try {

            await axiosInstance.post(
                "/admin/auth/logout"
            );

            setAdmin(null);

            toast.success("Logged out successfully");

            return true;

        } catch (error) {

            console.log("Admin Logout Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Logout failed"
            );

            return false;
        }
    };
    const getDashboardData = async () => {
        try {
            setIsDashboardLoading(true);
            const res = await axiosInstance.get("/admin/functions/dashboard");
            setDashboardData(res.data);

        } catch (error) {
            console.log("Error in getDashboardData:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsDashboardLoading(false);
        }
    };
    const getAllProducts = async () => {
        try {
            setIsProductsLoading(true);

            const res = await axiosInstance.get("/admin/functions/all-product");
            setProducts(res.data.products);

        } catch (error) {
            console.log("Error in getAllProducts:", error);
            toast.error(error.response?.data?.message || "Something went wrong");

        } finally {
            setIsProductsLoading(false);
        }
    };
    const addProduct = async (productData) => {
        try {
            setIsAddingProduct(true);

            const res = await axiosInstance.post(
                "/admin/functions/add-product",
                productData
            );

            toast.success("Product Added successfully");
            return true;

        } catch (error) {
            console.log("Error in addProduct:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
            return false;

        } finally {
            setIsAddingProduct(false);
        }
    };
    const getAllOrders = async () => {
        try {
            setIsOrdersLoading(true);

            const res = await axiosInstance.get(
                "/admin/functions/all-order"
            );

            setOrders(res.data.orders);

        } catch (error) {
            console.log("Error in getAllOrders:", error);

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );

        } finally {
            setIsOrdersLoading(false);
        }
    };
    const getOrderById = async (orderId) => {
        try {
            setIsOrderDetailsLoading(true);

            const res = await axiosInstance.get(
                `/admin/functions/order/${orderId}`
            );

            setSelectedOrder(res.data.order);

            return true;

        } catch (error) {
            console.log("Error in getOrderById:", error);

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );

            return false;

        } finally {
            setIsOrderDetailsLoading(false);
        }
    };
    const getAllUsers = async () => {
        try {
            setIsUsersLoading(true);

            const res = await axiosInstance.get(
                "/admin/functions/all-user"
            );

            setUsers(res.data.users);

        } catch (error) {
            console.log("Error in getAllUsers:", error);

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );

        } finally {
            setIsUsersLoading(false);
        }
    };
    const getAllSellers = async () => {
        try {
            setIsSellersLoading(true);

            const res = await axiosInstance.get(
                "/admin/functions/all-seller"
            );

            setSellers(res.data.sellers);

        } catch (error) {
            console.log("Error in getAllSellers:", error);

            toast.error(error.response?.data?.message || "Something went wrong");

        } finally {
            setIsSellersLoading(false);
        }
    };
    const getAllSellerProducts = async () => {
        try {
            setIsSellerProductsLoading(true);

            const res = await axiosInstance.get(
                "/admin/functions/all-sellerproduct"
            );

            setSellerProducts(res.data.sellerProducts);

        } catch (error) {
            console.log("Error in getAllSellerProducts:", error);

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );

        } finally {
            setIsSellerProductsLoading(false);
        }
    };
    const getSellerById = async (sellerId) => {
        try {

            setIsSellerDetailsLoading(true);

            const response = await axiosInstance.get(
                `/admin/functions/${sellerId}`,
                {
                    withCredentials: true
                }
            );

            setSelectedSeller(response.data.seller);

            return response.data.seller;

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to get seller details"
            );

            return null;

        } finally {

            setIsSellerDetailsLoading(false);
        }
    };
    const updateSellerStatus = async (
        sellerId,
        seller_status,
        rejection_reason
    ) => {
        try {

            setIsUpdatingSellerStatus(true);
            console.log("Updating seller...")
            const response = await axiosInstance.patch(
                `/admin/functions/${sellerId}/status`,
                {
                    seller_status,
                    rejection_reason
                },
                {
                    withCredentials: true
                }
            );
            console.log("Updating seller...")

            toast.success(
                response.data.message
            );

            setSelectedSeller(response.data.seller);

            setSellers(prev =>
                prev.map(seller =>
                    seller.seller_id === sellerId
                        ? {
                            ...seller,
                            seller_status: response.data.seller.seller_status,
                            rejection_reason: response.data.seller.rejection_reason
                        }
                        : seller
                )
            );
            console.log("Updating seller...")

            return true;

        }  catch (error) {
            console.log("STATUS UPDATE ERROR:", error);
            console.log("STATUS UPDATE RESPONSE:", error.response?.data);
            console.log("STATUS UPDATE STATUS:", error.response?.status);

            toast.error(
                error.response?.data?.message ||
                "Failed to update seller status"
            );

            return false;
        } finally {

        setIsUpdatingSellerStatus(false);
    }
};

const contextValue = {
    admin, selectedSeller, setSelectedSeller,
    isSellerDetailsLoading,
    updateSellerStatus,
    isUpdatingSellerStatus, isAdminLoading, otpSending, isLoggingIn, dashboardState, setDashboardState, dashboardData, isDashboardLoading, products, isProductsLoading, isAddingProduct, orders, isOrdersLoading, selectedOrder, isOrderDetailsLoading, users, isUsersLoading, sellers, isSellersLoading, sellerProducts, isSellerProductsLoading, sendOtp, login, logout, getDashboardData, getAllProducts, addProduct, getAllOrders, getOrderById, getAllUsers, getAllSellers, getAllSellerProducts, getSellerById, updateSellerStatus
};
return (
    <>
        <AdminContext.Provider value={contextValue} >
            {children}
        </AdminContext.Provider >
    </>
)
}
export default AdminProvider;
