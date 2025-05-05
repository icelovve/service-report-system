import AdminLayout from '@/pages/components/layouts/AdminLayout'
import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2'

const index = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`);
            const data = await response.json();
            setUsers(data.data || data);
        } catch (e) {
            setError('ไม่สามารถโหลดข้อมูลผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        try {
            const confirmResult = await Swal.fire({
                title: "Are you sure?",
                text: "Are you sure you want to delete this user?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#808080",
                confirmButtonText: "Yes, delete it!"
            });
    
            if (!confirmResult.isConfirmed) {
                return;
            }
    
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/delete/${userId}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
    
            await Swal.fire({
                title: "Deleted!",
                text: "User has been deleted successfully.",
                showConfirmButton: false,
                icon: "success",
                timer: 1500
            });

            window.location.reload();
    
        } catch (error) {
            console.error('Error deleting user:', error);
            await Swal.fire({
                title: "Error!",
                text: "An error occurred while deleting the user. Please try again later.",
                icon: "error"
            });
        }
    };

    const getRoleText = (role) => {
        switch (role) {
            case 'admin':
                return <span className="text-yellow-600">Admin</span>;
            case 'user':
                return <span className="text-green-600">User</span>;
            default:
                return <span className="text-red-600">Unknown</span>;
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = (
            user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
            user.last_name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase())
        );
        const matchesRole = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-EN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            console.error("Error formatting date:", e);
            return dateString;
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2">กำลังโหลดข้อมูล...</span>
                </div>
            </AdminLayout>
        );
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg shadow">
                        <span className="font-medium">{error}</span>
                        <button 
                            onClick={() => {
                                setError(null);
                                fetchUsers();
                            }}
                            className="ml-4 text-sm text-blue-600 hover:underline"
                        >
                            ลองใหม่
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head>
                <title>Admin - User Management</title>
                <meta name='description' content='Admin User Management Page' />
            </Head>

            <div className="col col-auto mt-4 mx-4">
                <h1 className="font-bold text-xl text-center">User Management</h1>
                <div className="flex justify-between items-center my-4">
                    <input
                        type="search"
                        className="block w-1/3 py-2 px-3 text-sm border border-gray-300 rounded-lg"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="ml-4 py-2 px-3 text-sm border border-gray-300 rounded-lg"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>

                <div className="relative overflow-x-auto border sm:rounded-lg mt-8">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-center">User ID</th>
                                <th className="px-6 py-3 text-center">Name</th>
                                <th className="px-6 py-3 text-center">Email</th>
                                <th className="px-6 py-3 text-center">Phone</th>
                                <th className="px-6 py-3 text-center">Created At</th>
                                {/* <th className="px-6 py-3 text-center">Updated At</th> */}
                                <th className="px-6 py-3 text-center">Role</th>
                                <th className="px-6 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500 bg-gray-50">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.user_id} className="bg-white border-b hover:bg-gray-50">
                                        <th className="px-6 py-4 font-medium text-gray-900 text-center whitespace-nowrap">
                                            {user.user_id}
                                        </th>
                                        <td className="px-6 py-4 text-center">
                                            {user.first_name} {user.last_name}
                                        </td>
                                        <td className="px-6 py-4 text-center">{user.email}</td>
                                        <td className="px-6 py-4 text-center">{user.phone_number}</td>
                                        <td className="px-6 py-4 text-center">{formatDate(user.created_at)}</td>
                                        {/* <td className="px-6 py-4 text-center">{user.updated_at}</td> */}
                                        <td className="px-6 py-4 text-center">{getRoleText(user.role)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDeleteUser(user.user_id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    fill="none" 
                                                    viewBox="0 0 24 24" 
                                                    strokeWidth={1.5} 
                                                    stroke="currentColor" 
                                                    className="size-4"
                                                >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" 
                                                />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

export default index;