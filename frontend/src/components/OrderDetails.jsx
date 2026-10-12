import React, { useContext, useEffect } from "react";
import { AdminContext } from "../contexts/AdminContext";

function OrderDetails({ orderId, setOrderState }) {

    const {
        selectedOrder,
        isOrderDetailsLoading,
        getOrderById
    } = useContext(AdminContext);

    useEffect(() => {
        getOrderById(orderId);
    }, [orderId]);

    if (isOrderDetailsLoading || !selectedOrder) {
        return <div>Loading order details...</div>;
    }

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Order #{selectedOrder.order_id}
                    </h1>

                    <p className="text-gray-500 text-sm mt-1">
                        Order details
                    </p>
                </div>

                <button
                    onClick={() => setOrderState("all-orders")}
                    className="border px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                    ← Back to Orders
                </button>

            </div>

            {/* Customer Information */}
            <div className="bg-white border rounded-xl p-5">

                <h2 className="text-lg font-semibold mb-4">
                    Customer Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <p className="text-sm text-gray-500">
                            Name
                        </p>

                        <p className="font-medium">
                            {selectedOrder.user_name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Email
                        </p>

                        <p className="font-medium">
                            {selectedOrder.user_email}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Shipping Name
                        </p>

                        <p className="font-medium">
                            {selectedOrder.shipping_name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Mobile
                        </p>

                        <p className="font-medium">
                            {selectedOrder.shipping_mobile}
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <p className="text-sm text-gray-500">
                            Shipping Address
                        </p>

                        <p className="font-medium">
                            {selectedOrder.shipping_address}
                        </p>
                    </div>

                </div>

            </div>

            {/* Payment Information */}
            <div className="bg-white border rounded-xl p-5">

                <h2 className="text-lg font-semibold mb-4">
                    Payment Information
                </h2>

                <p>
                    <span className="text-gray-500">
                        Payment Method:
                    </span>{" "}
                    <span className="font-medium">
                        {selectedOrder.payment_method}
                    </span>
                </p>

            </div>

            {/* Order Items */}
            <div className="bg-white border rounded-xl overflow-hidden">

                <div className="p-5 border-b">
                    <h2 className="text-lg font-semibold">
                        Order Items
                    </h2>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 border-b">

                            <tr>

                                <th className="text-left px-5 py-3">
                                    Product
                                </th>

                                <th className="text-left px-5 py-3">
                                    Brand
                                </th>

                                <th className="text-left px-5 py-3">
                                    Seller
                                </th>

                                <th className="text-left px-5 py-3">
                                    Quantity
                                </th>

                                <th className="text-left px-5 py-3">
                                    Unit Price
                                </th>

                                <th className="text-left px-5 py-3">
                                    Total
                                </th>

                                <th className="text-left px-5 py-3">
                                    Status
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {selectedOrder.items?.map((item) => (

                                <tr
                                    key={item.sellerproduct_id}
                                    className="border-b last:border-b-0"
                                >

                                    <td className="px-5 py-3 font-medium">
                                        {item.product_name}
                                    </td>

                                    <td className="px-5 py-3">
                                        {item.product_brand}
                                    </td>

                                    <td className="px-5 py-3">
                                        {item.seller_name}
                                    </td>

                                    <td className="px-5 py-3">
                                        {item.quantity}
                                    </td>

                                    <td className="px-5 py-3">
                                        ₹{item.unit_price}
                                    </td>

                                    <td className="px-5 py-3">
                                        ₹{item.price}
                                    </td>

                                    <td className="px-5 py-3">
                                        {item.item_status}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Order Summary */}
            <div className="bg-white border rounded-xl p-5">

                <h2 className="text-lg font-semibold mb-4">
                    Order Summary
                </h2>

                <div className="space-y-2 max-w-sm ml-auto">

                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{selectedOrder.sub_total}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Discount</span>
                        <span>₹{selectedOrder.discount}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>₹{selectedOrder.delivery_fee}</span>
                    </div>

                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>
                            ₹{selectedOrder.total_amount_payable}
                        </span>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default OrderDetails;