import React, { useContext } from "react";
import { AdminContext } from "../contexts/AdminContext";

import AdminDashboardHome from "../components/AdminDashboardHome";
import AdminProducts from "../components/AdminProducts";
import AdminOrders from "../components/AdminOrders";
import AdminUsers from "../components/AdminUsers";
import AdminSellers from "../components/AdminSellers";
import AdminSellerProducts from "../components/AdminSellerProducts";

function AdminDashboard() {

    const {
        dashboardState,
        setDashboardState, logout
    } = useContext(AdminContext);

    const renderDashboardContent = () => {

        if (dashboardState === "dashboard") {
            return <AdminDashboardHome />;
        }

        if (dashboardState === "products") {
            return <AdminProducts />;
        }

        if (dashboardState === "orders") {
            return <AdminOrders />;
        }

        if (dashboardState === "users") {
            return <AdminUsers />;
        }

        if (dashboardState === "sellers") {
            return <AdminSellers />;
        }
        if (dashboardState === "sellerproducts") {
            return <AdminSellerProducts />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Top Navbar */}
            <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6">

                <h1 className="text-2xl font-bold text-blue-600">
                    MARKETIX ADMIN
                </h1>

                <div className="flex items-center gap-5">

                    <span className="font-medium">
                        Admin 👤
                    </span>

                    <button
                        onClick={logout}
                        className="text-red-600 hover:underline"
                    >
                        Logout
                    </button>

                </div>
            </div>

            {/* Main Layout */}
            <div className="flex min-h-[calc(100vh-64px)]">

                {/* Sidebar */}
                <div className="w-64 bg-white shadow-sm p-5">

                    <h2 className="text-lg font-semibold mb-6">
                        Admin Panel
                    </h2>

                    {/* Dashboard */}
                    <button
                        onClick={() => setDashboardState("dashboard")}
                        className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${dashboardState === "dashboard" ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
                    >
                        📊 Dashboard
                    </button>

                    {/* Products */}
                    <button
                        onClick={() => setDashboardState("products")}
                        className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${dashboardState === "products" ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
                    >
                        📦 Products
                    </button>

                    {/* Orders */}
                    <button
                        onClick={() => setDashboardState("orders")}
                        className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${dashboardState === "orders" ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
                    >
                        🛒 Orders
                    </button>

                    {/* Users */}
                    <button
                        onClick={() => setDashboardState("users")}
                        className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${dashboardState === "users" ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
                    >
                        👤 Users
                    </button>

                    {/* Sellers */}
                    <button
                        onClick={() => setDashboardState("sellers")}
                        className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${dashboardState === "sellers" ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
                    >
                        🏪 Sellers
                    </button>

                    {/* Seller Products */}
                    <button
                        onClick={() => setDashboardState("sellerproducts")}
                        className={`w-full text-left px-4 py-3 rounded-lg mb-2 ${dashboardState === "sellerproducts" ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
                    >
                        🏷️ Seller Products
                    </button>

                    {/* Logout */}
                    <button
                        onClick={logout}
                        className="w-full text-left px-4 py-3 rounded-lg mt-8 text-red-500 hover:bg-red-50"
                    >
                        🚪 Logout
                    </button>

                </div>
                {/* Content Area */}
                <div className="flex-1 p-8">

                    {renderDashboardContent()}

                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;