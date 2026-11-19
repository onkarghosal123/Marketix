import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function OrderSuccess() {

    const navigate = useNavigate();

    const { orderId } = useParams();

    const {
        order,
        getOrderById,
        isOrderLoading
    } = useContext(UserContext);


    useEffect(() => {

        if (orderId) {
            getOrderById(orderId);
        }

    }, [orderId]);


    // Loading
    if (isOrderLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">
                    Loading order...
                </p>
            </div>
        );
    }


    // Order not found
    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <h1 className="text-2xl font-bold">
                        No Order Found
                    </h1>

                    <button
                        onClick={() => navigate("/")}
                        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg"
                    >
                        Go Home
                    </button>

                </div>

            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">

                {/* Success */}
                <div className="text-center">

                    <div className="text-5xl mb-4">
                        ✅
                    </div>

                    <h1 className="text-3xl font-bold">
                        Order Placed Successfully!
                    </h1>

                    <p className="text-gray-600 mt-3">
                        Thank you for your order.
                    </p>

                </div>


                {/* Order Details */}
                <div className="bg-gray-50 rounded-lg p-4 mt-6">

                    {/* Order ID */}
                    <div className="flex justify-between">
                        <span>
                            Order ID
                        </span>

                        <span className="font-semibold">
                            #{order.order_id}
                        </span>
                    </div>


                    {/* Subtotal */}
                    <div className="flex justify-between mt-3">
                        <span>
                            Subtotal
                        </span>

                        <span className="font-semibold">
                            ₹{order.sub_total}
                        </span>
                    </div>


                    {/* Discount */}
                    <div className="flex justify-between mt-3">
                        <span>
                            Discount
                        </span>

                        <span className="font-semibold">
                            - ₹{order.discount}
                        </span>
                    </div>


                    {/* Delivery */}
                    <div className="flex justify-between mt-3">
                        <span>
                            Delivery Fee
                        </span>

                        <span className="font-semibold">
                            ₹{order.delivery_fee}
                        </span>
                    </div>


                    {/* Total */}
                    <div className="flex justify-between mt-4 pt-3 border-t">

                        <span className="font-bold">
                            Total Amount
                        </span>

                        <span className="font-bold">
                            ₹{order.total_amount_payable}
                        </span>

                    </div>


                    {/* Payment Method */}
                    <div className="flex justify-between mt-3">

                        <span>
                            Payment Method
                        </span>

                        <span className="font-semibold">
                            {order.payment_method || "N/A"}
                        </span>

                    </div>


                    {/* Payment Status */}
                    <div className="flex justify-between mt-3">

                        <span>
                            Payment Status
                        </span>

                        <span className="font-semibold">
                            {order.payment_status || "N/A"}
                        </span>

                    </div>

                </div>


                {/* Continue Shopping */}
                <button
                    onClick={() => navigate("/")}
                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                    Continue Shopping
                </button>


                {/* View Orders */}
                <button
                    onClick={() => navigate("/orders")}
                    className="w-full mt-3 border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50"
                >
                    View All Orders
                </button>

            </div>

        </div>
    );
}

export default OrderSuccess;