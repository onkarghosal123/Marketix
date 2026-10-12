import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const SellerContext = createContext();

function SellerProvider({ children }) {
    const [otpSending, setOtpSending] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [seller, setSeller] = useState(null);
    const [isSellerLoading, setIsSellerLoading] = useState(true);
    const [dashboardState, setDashboardState] = useState("dashboard");
    const [dashboardData, setDashboardData] = useState(null);
    const [isDashboardLoading, setIsDashboardLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [sellerProducts, setSellerProducts] = useState([]);
    const [isProductsLoading, setIsProductsLoading] = useState(false);
    const [isAddingPrice, setIsAddingPrice] = useState(false);
    const [sellerAllProducts, setSellerAllProducts] = useState([]);
    const [isSellerProductsLoading, setIsSellerProductsLoading] = useState(false);
    const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);
    const [orderItems, setOrderItems] = useState([]);
    const [isOrderItemsLoading, setIsOrderItemsLoading] = useState(false);
    const [updatingOrderItemId, setUpdatingOrderItemId] = useState(null);
    useEffect(() => {
        getSeller();
    }, []);

    const getSeller = async () => {
        try {
            const res = await axiosInstance.get(
                "/seller/auth/me"
            );

            setSeller(res.data.seller);

        } catch (error) {
            setSeller(null);

        } finally {

            setIsSellerLoading(false);

        }
    };
    const sendOtp = async (data) => {

        try {
            console.log("data from seller sendotp", data)
            setOtpSending(true);

            const res = await axiosInstance.post(
                '/seller/auth/send-otp',
                data
            );

            toast.success("OTP sent");

            return true;

        } catch (error) {

            console.log(error);

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

            const res = await axiosInstance.post(
                "/seller/auth/login",
                data
            );

            setSeller(res.data.seller);

            toast.success("Logged in successfully");

            return true;

        } catch (error) {

            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Login failed"
            );

            return false;

        } finally {

            setIsLoggingIn(false);
        }
    };
    const register = async (data) => {
        try {
            setIsRegistering(true);
            console.log(data)
            const response = await axiosInstance.post("/seller/auth/register", data);
            console.log("after api call")
            toast.success(
                response.data.message || "Seller account created successfully"
            );

            return true;

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Seller registration failed"
            );

            return false;

        } finally {
            setIsRegistering(false);
        }
    };
    const logout = async () => {

        try {

            await axiosInstance.post(
                "/seller/auth/logout"
            );

            setSeller(null);

            toast.success("Logged out successfully");

            return true;

        } catch (error) {

            console.log("Seller Logout Error:", error);

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

            const res = await axiosInstance.get(
                "/seller/functions/dashboard"
            );

            setDashboardData(res.data);

        } catch (error) {
            console.log("Error in getDashboardData:", error);

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {
            setIsDashboardLoading(false);
        }
    };
    const getAllProduct = async () => {
        try {
            setIsProductsLoading(true);

            const res = await axiosInstance.get(
                "/seller/functions/all-product"
            );

            setProducts(res.data.products);
            setSellerProducts(res.data.sellerProducts);

        } catch (error) {
            console.log("Error in getAllProduct:", error);

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

        } finally {
            setIsProductsLoading(false);
        }
    };
    const addPrice = async (priceData) => {
        try {
            setIsAddingPrice(true);

            await axiosInstance.post(
                "/seller/functions/add-price",
                priceData
            );

            toast.success("Price added successfully");

            return true;

        } catch (error) {
            console.log("Error in addPrice:", error);

            toast.error(
                error.response?.data?.message ||
                "Something went wrong"
            );

            return false;

        } finally {
            setIsAddingPrice(false);
        }
    };
    const getSellerProduct = async () => {
        try {
            setIsSellerProductsLoading(true);

            const res = await axiosInstance.get(
                "/seller/functions/seller-product"
            );

            setSellerAllProducts(res.data.sellerProducts);
        } catch (error) {
            console.log("Error in getSellerProduct:", error);

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setIsSellerProductsLoading(false);
        }
    };
    const updatePrice = async (priceData) => {
        try {
            setIsUpdatingPrice(true);

            const res = await axiosInstance.post(
                "/seller/functions/update-price",
                priceData
            );

            toast.success(res.data.message);

            return true;
        } catch (error) {
            console.log("Error in updatePrice:", error);

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );

            return false;
        } finally {
            setIsUpdatingPrice(false);
        }
    };
    const getAllOrderItems = async () => {
        try {
            setIsOrderItemsLoading(true);

            const res = await axiosInstance.get(
                "/seller/functions/all-order-items"
            );

            setOrderItems(res.data.allOrderItems);
        } catch (error) {
            console.log("Error in getAllOrderItems:", error);

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        } finally {
            setIsOrderItemsLoading(false);
        }
    };
    const updateOrderItemStatus = async (orderitems_id, status) => {
        try {
            setUpdatingOrderItemId(orderitems_id);

            const res = await axiosInstance.post(
                "/seller/functions/update-orderitem-status",
                {
                    orderitems_id,
                    status
                }
            );

            toast.success(res.data.message);

            await getAllOrderItems();

            return true;
        } catch (error) {
            console.log("Error in updateOrderItemStatus:", error);

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );

            return false;
        } finally {
            setUpdatingOrderItemId(null);
        }
    };
    const updateSellerApplication = async (formData) => {
        try {
            const response = await axiosInstance.patch(
                "/seller/functions/update-application",
                formData,
                { withCredentials: true }
            );
            setSeller(response.data.seller);
            toast.success("Seller updated successfully.");
            return true;
        } catch (error) {
            console.log("Update seller application error:", error.response?.data);

            toast.error(
                error.response?.data?.message ||
                "Failed to update seller application"
            );

            return false;
        }
    };

    const contextValue = {
        otpSending, isLoggingIn, isRegistering, seller, isSellerLoading, dashboardState, setDashboardState, dashboardData, isDashboardLoading, products, sellerProducts, isProductsLoading, isAddingPrice, sellerAllProducts, isSellerProductsLoading, isUpdatingPrice, orderItems, isOrderItemsLoading, updatingOrderItemId, sendOtp, login, register, logout, getDashboardData, getAllProduct, addPrice, getSellerProduct, updatePrice, getAllOrderItems, updateOrderItemStatus, updateSellerApplication
    }
    return (
        <>
            <SellerContext.Provider value={contextValue} >
                {children}
            </SellerContext.Provider >
        </>
    )
}
export default SellerProvider
