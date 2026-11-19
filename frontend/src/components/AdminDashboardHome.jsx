import React, { useContext, useEffect } from "react";
import { AdminContext } from "../contexts/AdminContext";

function DashboardHome() {

    const {
        dashboardData,
        isDashboardLoading,
        getDashboardData
    } = useContext(AdminContext);

    useEffect(() => {
        getDashboardData();
    }, []);

    if (isDashboardLoading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <p className="text-gray-500 mt-1">
                    Welcome to Marketix Admin Panel
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                {/* Products */}
                <div className="bg-white rounded-xl shadow-sm p-4 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">
                                Products
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-1">
                                {dashboardData?.products || 0}
                            </h2>
                        </div>

                        <div className="text-3xl">
                            📦
                        </div>
                    </div>
                </div>

                {/* Seller Products */}
                <div className="bg-white rounded-xl shadow-sm p-4 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">
                                Seller Products
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-1">
                                {dashboardData?.sellerProducts || 0}
                            </h2>
                        </div>

                        <div className="text-3xl">
                            🏷️
                        </div>
                    </div>
                </div>

                {/* Orders */}
                <div className="bg-white rounded-xl shadow-sm p-4 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">
                                Orders
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-1">
                                {dashboardData?.orders || 0}
                            </h2>
                        </div>

                        <div className="text-3xl">
                            🛒
                        </div>
                    </div>
                </div>

                {/* Users */}
                <div className="bg-white rounded-xl shadow-sm p-4 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">
                                Users
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-1">
                                {dashboardData?.users || 0}
                            </h2>
                        </div>

                        <div className="text-3xl">
                            👤
                        </div>
                    </div>
                </div>

                {/* Sellers */}
                <div className="bg-white rounded-xl shadow-sm p-4 border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">
                                Sellers
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800 mt-1">
                                {dashboardData?.sellers || 0}
                            </h2>
                        </div>

                        <div className="text-3xl">
                            🏪
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default DashboardHome;