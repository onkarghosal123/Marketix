import React, { useContext, useEffect, useState } from "react";
import { SellerContext } from "../contexts/SellerContext";
import AddPrice from "./AddPrice";

function Products() {
 
const {
    products,
    sellerProducts,
    isProductsLoading,
    getAllProduct
} = useContext(SellerContext);

const [productState, setProductState] = useState("all-products");
const [selectedProduct, setSelectedProduct] = useState(null);

useEffect(() => {
    if (productState === "all-products") {
        getAllProduct();
    }
}, [productState]);

// Show Add Price
if (productState === "add-price") {
    return (
        <AddPrice
            selectedProduct={selectedProduct}
            setProductState={setProductState}
        />
    );
}

// Loading
if (isProductsLoading) {
    return (
        <div className="text-gray-600">
            Loading products...
        </div>
    );
}

// Check whether seller already added this product
const isProductAdded = (productId) => {
    return sellerProducts?.some(
        (sellerProduct) =>
            sellerProduct.product_id === productId
    );
};

return (
    <div className="space-y-5">

        {/* Header */}
        <div>
            <h1 className="text-2xl font-bold text-gray-800">
                Products
            </h1>

            <p className="text-gray-500 text-sm mt-1">
                Select a product and add your price
            </p>
        </div>

        {/* Products Table */}
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
                                Sub Category
                            </th>

                            <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                Brand
                            </th>

                            <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {products?.length > 0 ? (

                            products.map((product) => {

                                const alreadyAdded =
                                    isProductAdded(product.product_id);

                                return (
                                    <tr
                                        key={product.product_id}
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-3">
                                            {product.product_id}
                                        </td>

                                        <td className="px-5 py-3 font-medium text-gray-800">
                                            {product.product_name}
                                        </td>

                                        <td className="px-5 py-3">
                                            {product.product_category}
                                        </td>

                                        <td className="px-5 py-3">
                                            {product.product_sub_category}
                                        </td>

                                        <td className="px-5 py-3">
                                            {product.product_brand}
                                        </td>

                                        <td className="px-5 py-3">

                                            {alreadyAdded ? (

                                                <span className="text-green-600 font-medium">
                                                    Already Added
                                                </span>

                                            ) : (

                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setProductState("add-price");
                                                    }}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                                >
                                                    Add Price
                                                </button>

                                            )}

                                        </td>

                                    </tr>
                                );
                            })

                        ) : (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="text-center py-8 text-gray-500"
                                >
                                    No products found
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

export default Products;
