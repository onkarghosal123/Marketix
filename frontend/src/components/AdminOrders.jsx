import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../contexts/AdminContext";
import OrderDetails from "./OrderDetails";

function Orders() {

    const { orders, isOrdersLoading, getAllOrders } = useContext(AdminContext);
    const [orderState, setOrderState] = useState("all-orders");
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    useEffect(() => {
        if (orderState === "all-orders") {
            getAllOrders();
        }
    }, [orderState]);

    if (orderState === "order-details") {
        return (
            <OrderDetails
                orderId={selectedOrderId}
                setOrderState={setOrderState}
            />
        );
    }

    if (isOrdersLoading) {
        return <div>Loading orders...</div>;
    }

    return (
        <div className="space-y-5">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Orders
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                    Manage all customer orders
                </p>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                <div className="overflow-x-auto">
                    <table className="w-full">

                        <thead className="bg-gray-50 border-b">
                            <tr>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Order ID
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Customer
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Email
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Date
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Amount
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Action
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {orders?.length > 0 ? (
                                orders.map((order) => (
                                    <tr
                                        key={order.order_id}
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-3 font-medium">
                                            #{order.order_id}
                                        </td>

                                        <td className="px-5 py-3">
                                            {order.user_name}
                                        </td>

                                        <td className="px-5 py-3">
                                            {order.user_email}
                                        </td>

                                        <td className="px-5 py-3">
                                            {new Date(
                                                order.order_date
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="px-5 py-3 font-medium">
                                            ₹{order.total_amount_payable}
                                        </td>

                                        <td className="px-5 py-3">

                                            <button
                                                onClick={() => {
                                                    setSelectedOrderId(order.order_id);
                                                    setOrderState("order-details");
                                                }}
                                                className="text-blue-600 hover:underline"
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No orders found
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>
                </div>

            </div>

        </div>
    );
}

export default Orders;