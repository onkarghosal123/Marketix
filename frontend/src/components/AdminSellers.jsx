import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../contexts/AdminContext";

function AdminSellers() {

    const {
        sellers,
        isSellersLoading,
        getAllSellers,

        selectedSeller,
        setSelectedSeller,
        getSellerById,
        isSellerDetailsLoading,

        updateSellerStatus,
        isUpdatingSellerStatus
    } = useContext(AdminContext);

    const [reason, setReason] = useState("");
    const [showSellerDetails, setShowSellerDetails] = useState(false);

    useEffect(() => {
        getAllSellers();
    }, []);

    const handleViewDetails = async (sellerId) => {
        setShowSellerDetails(true);
        setSelectedSeller(null);

        await getSellerById(sellerId);
    };
    const handleStatusUpdate = async (status) => {

        if (!reason.trim()) {
            return;
        }

        const success = await updateSellerStatus(
            selectedSeller.seller_id,
            status,
            reason
        );

        if (success) {
            setReason("");
            setSelectedSeller(null);
        }
    };

    const getStatusClass = (status) => {

        if (status === "approved") {
            return "bg-green-100 text-green-700";
        }

        if (status === "rejected") {
            return "bg-red-100 text-red-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    if (isSellersLoading) {
        return <div>Loading sellers...</div>;
    }

    return (
        <div className="space-y-5">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Sellers
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                    Manage all registered sellers
                </p>
            </div>

            {/* Sellers Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50 border-b">
                            <tr>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    ID
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Seller Name
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Email
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    City
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

                            {sellers?.length > 0 ? (

                                sellers.map((seller) => (

                                    <tr
                                        key={seller.seller_id}
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-3">
                                            {seller.seller_id}
                                        </td>

                                        <td className="px-5 py-3 font-medium text-gray-800">
                                            {seller.seller_name}
                                        </td>

                                        <td className="px-5 py-3">
                                            {seller.seller_email}
                                        </td>

                                        <td className="px-5 py-3">
                                            {seller.seller_city || "-"}
                                        </td>

                                        <td className="px-5 py-3">

                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                                    seller.seller_status
                                                )}`}
                                            >
                                                {seller.seller_status}
                                            </span>

                                        </td>

                                        <td className="px-5 py-3">

                                            <button
                                                onClick={() =>
                                                    handleViewDetails(
                                                        seller.seller_id
                                                    )
                                                }
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                            >
                                                View Details
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
                                        No sellers found
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* Seller Details */}
            {showSellerDetails && (

                <div className="bg-white rounded-xl shadow-lg border p-6">

                    {isSellerDetailsLoading ? (

                        <div className="py-10 text-center">
                            Loading seller details...
                        </div>

                    ) : selectedSeller ? (

                        <>

                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">

                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        Seller Details
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Review seller business information
                                    </p>
                                </div>

                                <button
                                    onClick={() => {
                                        setShowSellerDetails(false);
                                        setSelectedSeller(null);
                                        setReason("");
                                    }}
                                    className="text-gray-500 hover:text-gray-800 text-xl"
                                >
                                    ✕
                                </button>

                            </div>


                            {/* Seller Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Seller ID
                                    </p>

                                    <p className="font-semibold">
                                        {selectedSeller.seller_id}
                                    </p>
                                </div>


                                <div>
                                    <p className="text-sm text-gray-500">
                                        Seller Name
                                    </p>

                                    <p className="font-semibold">
                                        {selectedSeller.seller_name}
                                    </p>
                                </div>


                                <div>
                                    <p className="text-sm text-gray-500">
                                        Contact
                                    </p>

                                    <p className="font-semibold">
                                        {selectedSeller.seller_contact}
                                    </p>
                                </div>


                                <div>
                                    <p className="text-sm text-gray-500">
                                        Email
                                    </p>

                                    <p className="font-semibold">
                                        {selectedSeller.seller_email}
                                    </p>
                                </div>


                                <div>
                                    <p className="text-sm text-gray-500">
                                        City
                                    </p>

                                    <p className="font-semibold">
                                        {selectedSeller.seller_city}
                                    </p>
                                </div>


                                <div>
                                    <p className="text-sm text-gray-500">
                                        Registration Date
                                    </p>

                                    <p className="font-semibold">
                                        {selectedSeller.seller_registration_date
                                            ? new Date(
                                                selectedSeller.seller_registration_date
                                            ).toLocaleDateString()
                                            : "-"
                                        }
                                    </p>
                                </div>


                                <div className="md:col-span-2">

                                    <p className="text-sm text-gray-500">
                                        Business Location
                                    </p>

                                    <p className="font-semibold">
                                        {selectedSeller.seller_location || "-"}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-sm text-gray-500">
                                        Current Status
                                    </p>

                                    <span
                                        className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                                            selectedSeller.seller_status
                                        )}`}
                                    >
                                        {selectedSeller.seller_status}
                                    </span>

                                </div>

                            </div>


                            {/* Reason */}
                            <div className="mt-7">

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Reason
                                </label>

                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Enter reason for approval or rejection..."
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <p className="text-xs text-gray-500 mt-1">
                                    This reason will be saved as rejection_reason.
                                </p>

                            </div>


                            {/* Actions */}
                            <div className="flex gap-4 mt-6">

                                <button
                                    onClick={() =>
                                        handleStatusUpdate("approved")
                                    }
                                    disabled={isUpdatingSellerStatus}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                                >
                                    {isUpdatingSellerStatus
                                        ? "Updating..."
                                        : "Approve"
                                    }
                                </button>


                                <button
                                    onClick={() =>
                                        handleStatusUpdate("rejected")
                                    }
                                    disabled={isUpdatingSellerStatus}
                                    className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
                                >
                                    {isUpdatingSellerStatus
                                        ? "Updating..."
                                        : "Reject"
                                    }
                                </button>

                            </div>

                        </>

                    ) : (

                        <div className="py-10 text-center text-gray-500">
                            Seller not found
                        </div>

                    )}

                </div>

            )}

        </div>
    );
}

export default AdminSellers;