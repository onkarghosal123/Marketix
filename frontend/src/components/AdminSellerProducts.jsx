import React, { useContext, useEffect } from "react";
import { AdminContext } from "../contexts/AdminContext";

function SellerProducts() {

    const {
        sellerProducts,
        isSellerProductsLoading,
        getAllSellerProducts
    } = useContext(AdminContext);

    useEffect(() => {
        getAllSellerProducts();
    }, []);

    if (isSellerProductsLoading) {
        return <div>Loading seller products...</div>;
    }

    return (
        <div className="space-y-5">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Seller Products
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                    Manage products added by sellers
                </p>
            </div>

            {/* Seller Products Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                <div className="overflow-x-auto">
                    <table className="w-full">

                        <thead className="bg-gray-50 border-b">
                            <tr>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    ID
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Seller ID
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Seller Name
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Product ID
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Product Name
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Available Quantity
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Price
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Action
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {sellerProducts?.length > 0 ? (
                                sellerProducts.map((sellerProduct) => (

                                    <tr
                                        key={sellerProduct.sellerproduct_id}
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-3 font-medium">
                                            {sellerProduct.sellerproduct_id}
                                        </td>

                                        <td className="px-5 py-3">
                                            {sellerProduct.seller_id}
                                        </td>
                                        <td className="px-5 py-3">
                                            {sellerProduct.seller_name}
                                        </td>

                                        <td className="px-5 py-3">
                                            {sellerProduct.product_id}
                                        </td>
                                        <td className="px-5 py-3">
                                            {sellerProduct.product_name}
                                        </td>

                                        <td className="px-5 py-3">
                                            {sellerProduct.available_quantity}
                                        </td>

                                        <td className="px-5 py-3">
                                            ₹{sellerProduct.price_per_unit}
                                        </td>

                                        <td className="px-5 py-3">

                                            <button className="text-blue-600 hover:underline mr-4">
                                                View
                                            </button>

                                            <button className="text-red-600 hover:underline">
                                                Delete
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
                                        No seller products found
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

export default SellerProducts;