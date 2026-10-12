import React, { useContext, useEffect, useState } from "react";
import { SellerContext } from "../contexts/SellerContext";

function Orders() {
    const {
        orderItems,
        isOrderItemsLoading,
        isUpdatingOrderStatus,
        getAllOrderItems,
        updateOrderItemStatus
    } = useContext(SellerContext);

    // Temporary UI state
    const [selectedStatus, setSelectedStatus] = useState({});

    useEffect(() => {
        getAllOrderItems();
    }, []);

    // Store selected status for each order item
    const handleStatusChange = (orderitems_id, status) => {
        setSelectedStatus((prev) => ({
            ...prev,
            [orderitems_id]: status
        }));
    };

    // Update status
    const handleUpdateStatus = async (orderitems_id) => {
        const status = selectedStatus[orderitems_id];

        const success = await updateOrderItemStatus(
            orderitems_id,
            status
        );

        if (success) {
            setSelectedStatus((prev) => {
                const updated = { ...prev };
                delete updated[orderitems_id];
                return updated;
            });
        }
    };
    if (isOrderItemsLoading) {
        return (
            <div className="text-gray-600">
                Loading orders...
            </div>
        );
    }

    return (
        <div className="space-y-5">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Orders
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                    Manage orders for your products
                </p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Order ID
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Product
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Quantity
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Unit Price
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Total Price
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Status
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {orderItems?.length > 0 ? (
                                orderItems.map((item) => {

                                    const selected =
                                        selectedStatus[item.orderitems_id];

                                    return (
                                        <tr
                                            key={item.orderitems_id}
                                            className="border-b last:border-b-0 hover:bg-gray-50"
                                        >

                                            {/* Order ID */}
                                            <td className="px-5 py-3 font-medium">
                                                #{item.order_id}
                                            </td>

                                            {/* Product */}
                                            <td className="px-5 py-3">
                                                <div className="font-medium text-gray-800">
                                                    {item.product_name}
                                                </div>

                                                <div className="text-sm text-gray-500">
                                                    {item.product_brand}
                                                </div>
                                            </td>

                                            {/* Quantity */}
                                            <td className="px-5 py-3">
                                                {item.quantity}
                                            </td>

                                            {/* Unit Price */}
                                            <td className="px-5 py-3">
                                                ₹{item.unit_price}
                                            </td>

                                            {/* Total Price */}
                                            <td className="px-5 py-3">
                                                ₹{item.price}
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-3">
                                                <select
                                                    value={
                                                        selected ||
                                                        item.status
                                                    }
                                                    onChange={(e) =>
                                                        handleStatusChange(
                                                            item.orderitems_id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="PENDING">
                                                        Pending
                                                    </option>

                                                    <option value="CONFIRMED">
                                                        Confirmed
                                                    </option>

                                                    <option value="PACKED">
                                                        Packed
                                                    </option>

                                                    <option value="OUT_FOR_DELIVERY">
                                                        Out for Delivery
                                                    </option>

                                                    <option value="DELIVERED">
                                                        Delivered
                                                    </option>

                                                    <option value="CANCELLED">
                                                        Cancelled
                                                    </option>
                                                </select>
                                            </td>

                                            {/* Update */}
                                            <td className="px-5 py-3">
                                                <button
                                                    onClick={() => handleUpdateStatus(item.orderitems_id)}
                                                    disabled={
                                                        !selected ||
                                                        updatingOrderItemId === item.orderitems_id
                                                    }
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {updatingOrderItemId === item.orderitems_id
                                                        ? "Updating..."
                                                        : "Update"}
                                                </button>
                                            </td>

                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No orders found.
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