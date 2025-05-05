import AdminLayout from '@/pages/components/layouts/AdminLayout';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

const Index = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rooms`);
            const data = await response.json();
            setRooms(data.data || data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            setError('ไม่สามารถโหลดข้อมูลห้องพักได้ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const getStatusText = (status) => {
        switch (status) {
            case 'Available':
                return <span className="text-green-600">Available</span>;
            case 'Unavailable':
                return <span className="text-red-600">Unavailable</span>;
            default:
                return <span className="text-yellow-600">No information found</span>;
        }
    };

    const updateStatusRoom = async (roomId, currentStatus) => {
        setUpdateLoading(true);
        try {
            const newStatus = currentStatus === 'Available' ? 'Unavailable' : 'Available';
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/rooms/edit-status-room/${roomId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Status: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || response.statusText);
            }

            setRooms(prevRooms =>
                prevRooms.map(room =>
                    room.RoomID === roomId
                        ? { ...room, Status: newStatus }
                        : room
                )
            );
        } catch (error) {
            console.error('Error updating room status:', error);
            setError('Failed to update room status. Please try again.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch = room.RoomNumber.toString().includes(search);
        const matchesStatus = !sortOrder || room.Status === sortOrder;
        return matchesSearch && matchesStatus;
    });

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
                                fetchRooms();
                            }}
                            className="ml-4 text-sm text-blue-600 hover:underline"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head>
                <title>Admin - Rooms</title>
                <meta name="description" content="Admin Rooms Page" />
            </Head>
            <div className="col col-auto mt-4 ml-3">
                <h1 className="font-bold text-xl text-center">All Rooms</h1>
                <div className="flex justify-between items-center my-4">
                    <input
                        type="search"
                        className="block w-1/3 py-2 px-3 text-sm border border-gray-300 rounded-lg"
                        placeholder="Search by Room Number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="ml-4 py-2 px-3 text-sm border border-gray-300 rounded-lg"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Unavailable">Unavailable</option>
                    </select>
                </div>

                <div className="relative overflow-x-auto border sm:rounded-lg mt-8">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-center">Room ID</th>
                                <th className="px-6 py-3 text-center">Room Number</th>
                                <th className="px-6 py-3 text-center">Room Type</th>
                                <th className="px-6 py-3 text-center">Price Per Night</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRooms.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 bg-gray-50">
                                        Room not found
                                    </td>
                                </tr>
                            ) : (
                                filteredRooms.map((room) => (
                                    <tr key={room.RoomID} className="bg-white border-b hover:bg-gray-50">
                                        <th className="px-6 py-4 font-medium text-gray-900 text-center whitespace-nowrap">
                                            {room.RoomID}
                                        </th>
                                        <td className="px-6 py-4 text-center">{room.RoomNumber}</td>
                                        <td className="px-6 py-4 text-center">
                                            {['Standard room', 'Luxurious room', 'Family room', 'Premium room'][room.RoomTypeID - 1] || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-center">${room.PricePerNight}</td>
                                        <td className="px-6 py-4 text-center">{getStatusText(room.Status)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => updateStatusRoom(room.RoomID, room.Status)}
                                                disabled={updateLoading}
                                                className="hover:text-[#d0865d] transition-colors disabled:opacity-50"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="size-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
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
};

export default Index;