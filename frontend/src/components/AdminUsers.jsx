import React, { useContext, useEffect } from "react";
import { AdminContext } from "../contexts/AdminContext";

function Users() {

    const {
        users,
        isUsersLoading,
        getAllUsers
    } = useContext(AdminContext);

    useEffect(() => {
        getAllUsers();
    }, []);

    if (isUsersLoading) {
        return <div>Loading users...</div>;
    }

    return (
        <div className="space-y-5">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Users
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                    Manage all registered users
                </p>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                <div className="overflow-x-auto">
                    <table className="w-full">

                        <thead className="bg-gray-50 border-b">
                            <tr>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    ID
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Name
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Email
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Mobile
                                </th>
                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    City
                                </th>

                                <th className="text-left px-5 py-3 text-sm font-semibold text-gray-600">
                                    Action
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {users?.length > 0 ? (
                                users.map((user) => (

                                    <tr
                                        key={user.user_id}
                                        className="border-b last:border-b-0 hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-3">
                                            {user.user_id}
                                        </td>

                                        <td className="px-5 py-3 font-medium text-gray-800">
                                            {user.user_name}
                                        </td>

                                        <td className="px-5 py-3">
                                            {user.user_email}
                                        </td>

                                        <td className="px-5 py-3">
                                            {user.user_contact || "-"}
                                        </td>
                                        <td className="px-5 py-3">
                                            {user.user_city || "-"}
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
                                        colSpan="5"
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No users found
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

export default Users;