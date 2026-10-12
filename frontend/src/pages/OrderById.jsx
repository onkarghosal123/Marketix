import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function OrderDetails() {

    const { orderid } = useParams();
    const navigate = useNavigate();
    const { order, isOrderLoading, getOrderById } = useContext(UserContext);

    useEffect(() => {
        getOrderById(orderid);
    }, [orderid]);


    if (isOrderLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">
                    Loading order details...
                </p>
            </div>
        );
    }


    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">

                <div className="text-center">

                    <h1 className="text-2xl font-bold">
                        Order Not Found
                    </h1>

                    <p className="text-gray-500 mt-2">
                        We couldn't find this order.
                    </p>

                    <button
                        onClick={() => navigate("/orders")}
                        className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                    >
                        View All Orders
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">

            <div className="max-w-5xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => navigate("/orders")}
                    className="text-blue-600 font-medium mb-6 hover:underline"
                >
                    ← Back to Orders
                </button>


                {/* Header */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>

                            <p className="text-sm text-gray-500">
                                Order ID
                            </p>

                            <h1 className="text-2xl font-bold">
                                #{order.order_id}
                            </h1>

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

                    </div>

                </div>


                {/* Order Items */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Order Items
                    </h2>

                    <div className="space-y-5">

                        {order.items.map((item) => (

                            <div
                                key={item.sellerproduct_id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5 last:border-b-0 last:pb-0"
                            >

                                {/* Product */}
                                <div>

                                    <h3 className="font-semibold text-lg">
                                        {item.product_name}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Brand: {item.product_brand}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Quantity: {item.quantity}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Unit Price: ₹{item.unit_price}
                                    </p>

                                </div>


                                {/* Price + Status */}
                                <div className="sm:text-right">

                                    <p className="font-bold text-lg">
                                        ₹{item.price}
                                    </p>

                                    <span
                                        className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${item.item_status === "DELIVERED"
                                            ? "bg-green-100 text-green-700"
                                            : item.item_status === "CANCELLED"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {item.item_status}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>


                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Shipping Information
                    </h2>

                    <div className="space-y-3">

                        <div>
                            <p className="text-sm text-gray-500">
                                Name
                            </p>

                            <p className="font-medium">
                                {order.shipping_name}
                            </p>
                        </div>


                        <div>
                            <p className="text-sm text-gray-500">
                                Mobile
                            </p>

                            <p className="font-medium">
                                {order.shipping_mobile}
                            </p>
                        </div>


                        <div>
                            <p className="text-sm text-gray-500">
                                Address
                            </p>

                            <p className="font-medium">
                                {order.shipping_address}
                            </p>
                        </div>

                    </div>

                </div>


                {/* Payment & Order Summary */}
                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Payment Details
                    </h2>

                    <div className="space-y-4">

                        {/* Sub Total */}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                Subtotal
                            </span>

                            <span className="font-medium">
                                ₹{order.sub_total}
                            </span>
                        </div>

                        {/* Discount */}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                Discount
                            </span>

                            <span className="font-medium text-green-600">
                                - ₹{order.discount}
                            </span>
                        </div>

                        {/* Delivery Fee */}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                                Delivery Fee
                            </span>

                            <span className="font-medium">
                                ₹{order.delivery_fee}
                            </span>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">
                                    Total Amount
                                </span>

                                <span className="text-2xl font-bold">
                                    ₹{order.total_amount_payable}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Payment Information */}
                    <div className="border-t mt-6 pt-6">

                        <h3 className="font-semibold text-lg mb-4">
                            Payment Information
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Payment Method */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    Payment Method
                                </p>

                                <p className="font-medium capitalize">
                                    {order.payment_method || "N/A"}
                                </p>
                            </div>

                            {/* Payment Status */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    Payment Status
                                </p>

                                <p
                                    className={`font-medium ${order.payment_status === "SUCCESS"
                                            ? "text-green-600"
                                            : order.payment_status === "FAILED"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                        }`}
                                >
                                    {order.payment_status || "N/A"}
                                </p>
                            </div>

                            {/* Payment Amount */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    Payment Amount
                                </p>

                                <p className="font-medium">
                                    ₹{order.payment_amount || 0}
                                </p>
                            </div>

                            {/* Payment Time */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    Payment Time
                                </p>

                                <p className="font-medium">
                                    {order.payment_time
                                        ? new Date(
                                            order.payment_time
                                        ).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })
                                        : "N/A"}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default OrderDetails;