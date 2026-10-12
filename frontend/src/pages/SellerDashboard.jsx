import React, { useContext } from "react";
import { SellerContext } from "../contexts/SellerContext";

import SellerDashboardHome from "../components/SellerDashboardHome";
import SellerProducts from "../components/SellerProducts";
import SellerSellerProducts from "../components/SellerSellerProducts";
import Orderitems from "../components/Orderitems";
import SellerAccountStatus from "../components/SellerAccountStatus";

function SellerDashboard() {

    const {
        seller,
        isSellerLoading,
        dashboardState,
        setDashboardState,
        logout
    } = useContext(SellerContext);

    // Loading seller information
    if (isSellerLoading) {
        return <div>Loading...</div>;
    }

    // Seller is not logged in
    if (!seller) {
        return <div>Please login as a seller.</div>;
    }

    // Application is pending
    if (seller.seller_status === "pending") {
        return (
            <SellerAccountStatus
                status="pending"
            />
        );
    }

    // Application is rejected
    if (seller.seller_status === "rejected") {
        console.log("seller:::",seller)
        return (
            <SellerAccountStatus
                status="rejected"
                reason={seller.rejection_reason}
            />
        );
    }

    // Only approved sellers can see dashboard
    if (seller.seller_status !== "approved") {
        return <div>Invalid seller status.</div>;
    }

    const renderDashboardContent = () => {

        if (dashboardState === "dashboard") {
            return <SellerDashboardHome />;
        }

        if (dashboardState === "products") {
            return <SellerProducts />;
        }

        if (dashboardState === "seller-products") {
            return <SellerSellerProducts />;
        }

        if (dashboardState === "orderitems") {
            return <Orderitems />;
        }

        return <SellerDashboardHome />;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r">

                <div className="p-5 border-b">
                    <h1 className="text-2xl font-bold text-blue-600">
                        MARKETIX
                    </h1>

                    <p className="text-sm text-gray-500">
                        Seller Panel
                    </p>
                </div>

                <nav className="p-4 space-y-2">

                    <button
                        onClick={() => setDashboardState("dashboard")}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50"
                    >
                        📊 Dashboard
                    </button>

                    <button
                        onClick={() => setDashboardState("products")}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50"
                    >
                        📦 Products
                    </button>

                    <button
                        onClick={() => setDashboardState("seller-products")}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50"
                    >
                        🏷️ My Products
                    </button>

                    <button
                        onClick={() => setDashboardState("orderitems")}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50"
                    >
                        🛒 Order Items
                    </button>

                </nav>

            </aside>

            {/* Main Content */}
            <main className="flex-1">

                {/* Header */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-6">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Seller Dashboard
                    </h2>

                    <div className="flex items-center gap-4">

                        <span className="text-sm text-gray-600">
                            {seller.seller_name} 👤
                        </span>

                        <button
                            onClick={logout}
                            className="text-red-600 hover:underline"
                        >
                            Logout
                        </button>

                    </div>

                </header>

                <section className="p-6">
                    {renderDashboardContent()}
                </section>

            </main>

        </div>
    );
}

export default SellerDashboard;