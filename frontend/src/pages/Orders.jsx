import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function Orders() {

    const navigate = useNavigate();

    const { orders,isOrdersLoading, getMyOrders} = useContext(UserContext);

    useEffect(() => {
        getMyOrders();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">

            <div className="max-w-5xl mx-auto">

                {/* Heading */}
                <div className="mb-8">

                    <h1 className="text-3xl font-bold">
                        My Orders
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View your order history
                    </p>

                </div>


                {/* Loading */}
                {isOrdersLoading ? (

                    <div className="bg-white rounded-xl shadow p-10 text-center">
                        <p className="text-gray-500">
                            Loading your orders...
                        </p>
                    </div>

                ) : orders.length === 0 ? (

                    /* No Orders */
                    <div className="bg-white rounded-xl shadow p-10 text-center">

                        <div className="text-5xl mb-4">
                            📦
                        </div>

                        <h2 className="text-xl font-semibold">
                            No Orders Found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            You haven't placed any orders yet.
                        </p>

                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                        >
                            Start Shopping
                        </button>

                    </div>

                ) : (

                    /* Orders */
                    <div className="space-y-5">

                        {orders.map((order) => (

                            <div
                                key={order.order_id}
                                className="bg-white rounded-xl shadow p-6"
                            >

                                {/* Top section */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">

                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Order ID
                                        </p>

                                        <p className="font-semibold text-lg">
                                            #{order.order_id}
                                        </p>

                                    </div>


                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Order Date
                                        </p>

                                        <p className="font-medium">
                                            {new Date(
                                                order.order_date
                                            ).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            })}
                                        </p>

                                    </div>


                                    {/* Payment Status */}
                                    <div>

                                        <p className="text-sm text-gray-500 mb-1">
                                            Payment Status
                                        </p>

                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                                order.status === "success" ||
                                                order.status === "paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : order.status === "failed"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {order.status}
                                        </span>

                                    </div>

                                </div>


                                {/* Order information */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-5">

                                    {/* Items */}
                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Items
                                        </p>

                                        <p className="font-semibold mt-1">
                                            {order.no_of_items}{" "}
                                            {Number(order.no_of_items) === 1
                                                ? "Item"
                                                : "Items"}
                                        </p>

                                    </div>


                                    {/* Shipping Name */}
                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Delivered To
                                        </p>

                                        <p className="font-semibold mt-1">
                                            {order.shipping_name}
                                        </p>

                                    </div>


                                    {/* Total */}
                                    <div>

                                        <p className="text-sm text-gray-500">
                                            Total Amount
                                        </p>

                                        <p className="font-bold text-lg mt-1">
                                            ₹{order.total_amount_payable}
                                        </p>

                                    </div>

                                </div>


                                {/* Address */}
                                <div className="bg-gray-50 rounded-lg p-4">

                                    <p className="text-sm text-gray-500">
                                        Shipping Address
                                    </p>

                                    <p className="font-medium mt-1">
                                        {order.shipping_address}
                                    </p>

                                </div>


                                {/* Bottom */}
                                <div className="flex justify-end mt-5">

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/orders/${order.order_id}`
                                            )
                                        }
                                        className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50"
                                    >
                                        View Details
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default Orders;