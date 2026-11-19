import React, { useContext, useEffect } from "react";
import { SellerContext } from "../contexts/SellerContext";


function DashboardHome() {

    const {
        dashboardData,
        isDashboardLoading,
        getDashboardData
    } = useContext(SellerContext);

    useEffect(() => {
        getDashboardData();
    }, []);

    if (isDashboardLoading) {
        return <div>Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Overview of your store
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">
                        Available Products
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        {dashboardData?.availableProducts || 0}
                    </h2>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">
                        My Products
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        {dashboardData?.myProducts || 0}
                    </h2>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">
                        Total Orders
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        {dashboardData?.totalOrders || 0}
                    </h2>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">
                        Pending Orders
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        {dashboardData?.pendingOrders || 0}
                    </h2>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">
                        To Deliver
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        {dashboardData?.toDeliverOrders || 0}
                    </h2>
                </div>

            </div>

        </div>
    );
}

export default DashboardHome;