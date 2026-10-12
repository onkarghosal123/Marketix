import React, { useContext, useEffect, useState } from "react";
import { SellerContext } from "../contexts/SellerContext";
import AddPrice from "./AddPrice";

function SellerSellerProducts() {
    const {
        sellerAllProducts,
        isSellerProductsLoading,
        getSellerProduct
    } = useContext(SellerContext);

    const [productState, setProductState] = useState("seller-products");
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        if (productState === "seller-products") {
            getSellerProduct();
        }
    }, [productState]);

    if (productState === "edit-price") {
        return (
            <AddPrice
                selectedProduct={selectedProduct}
                setProductState={setProductState}
                isEdit={true}
            />
        );
    }

    if (isSellerProductsLoading) {
        return <div className="text-gray-600">Loading your products...</div>;
    }

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    My Products
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                    Manage products added by you
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    ID
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Product Name
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Category
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Brand
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Price
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Quantity
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {sellerAllProducts?.length > 0 ? (
                                sellerAllProducts.map((product) => (
                                    <tr
                                        key={product.sellerproduct_id}
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-3">
                                            {product.sellerproduct_id}
                                        </td>

                                        <td className="px-5 py-3 font-medium text-gray-800">
                                            {product.product_name}
                                        </td>

                                        <td className="px-5 py-3">
                                            {product.product_category}
                                        </td>

                                        <td className="px-5 py-3">
                                            {product.product_brand}
                                        </td>

                                        <td className="px-5 py-3">
                                            ₹{product.price_per_unit}
                                        </td>

                                        <td className="px-5 py-3">
                                            {product.available_quantity}
                                        </td>

                                        <td className="px-5 py-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedProduct(product);
                                                    setProductState("edit-price");
                                                }}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-8 text-gray-500"
                                    >
                                        You have not added any products yet.
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

export default SellerSellerProducts;