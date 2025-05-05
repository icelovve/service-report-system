import AdminLayout from '@/pages/components/layouts/AdminLayout';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

const Index = () => {
    const [bookings, setBookings] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState(''); 
    const [sortOrder, setSortOrder] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings`);
                const data = await response.json();
                setBookings(data.data || data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setError('ไม่สามารถโหลดข้อมูลการจองได้ กรุณาลองใหม่อีกครั้ง');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-En', {
            style: 'currency',
            currency: 'THB'
        }).format(price);
    }

    const filteredBooking = bookings.filter((booking) => {
        const matchesSearch = booking.BookingID.toString().includes(search);
        const matchesStatus = !sortOrder || booking.Status === sortOrder;
        return matchesSearch && matchesStatus;
    });

    const getStatusText = (status) => {
        switch (status) {
            case 'Confirmed':
                return <span className="text-green-600">Confirmed</span>;
            case 'Pending':
                return <span className="text-yellow-600">Pending</span>;
            default:
                return <span className="text-red-600">Expired</span>;
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
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <Head>
                <title>Admin - Booking</title>
                <meta name="description" content="Admin Booking Page" />
            </Head>
            <div className="col col-auto mt-4 mx-4  ">
                <h1 className="font-bold text-xl text-center">All Bookings</h1>

                <div className="flex justify-between items-center my-4">
                    <input
                        type="search"
                        className="block w-1/3 py-2 px-3 text-sm border border-gray-300 rounded-lg"
                        placeholder="Search by Booking ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        className="ml-4 py-2 px-3 text-sm border border-gray-300 rounded-lg"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Expired">Expired</option>
                    </select>
                </div>

                <div className="relative overflow-x-auto border sm:rounded-lg mt-8">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-center">Booking ID</th>
                                <th className="px-6 py-3 text-center">Customer ID</th>
                                <th className="px-6 py-3 text-center">Room ID</th>
                                <th className="px-6 py-3 text-center">CheckIn Date</th>
                                <th className="px-6 py-3 text-center">CheckOut Date</th>
                                <th className="px-6 py-3 text-center">Booking Date</th>
                                <th className="px-6 py-3 text-center">Total Price</th>
                                <th className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooking.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500 bg-gray-50">
                                        Booking not found
                                    </td>
                                </tr>
                            ) : (
                                filteredBooking.map((booking) => (
                                    <tr key={booking.BookingID} className="bg-white border-b hover:bg-gray-50">
                                        <th className="px-6 py-4 font-medium text-gray-900 text-center whitespace-nowrap">
                                            {booking.BookingID}
                                        </th>
                                        <td className="px-6 py-4 text-center">{booking.CustomerID}</td>
                                        <td className="px-6 py-4 text-center">{booking.RoomID}</td>
                                        <td className="px-6 py-4 text-center">{formatDate(booking.CheckInDate)}</td>
                                        <td className="px-6 py-4 text-center">{formatDate(booking.CheckOutDate)}</td>
                                        <td className="px-6 py-4 text-center">{formatDate(booking.BookingDate)}</td>
                                        <td className="px-6 py-4 text-center">{formatPrice(booking.TotalPrice)}</td>
                                        <td className="px-6 py-4 text-center">{getStatusText(booking.Status)}</td>
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