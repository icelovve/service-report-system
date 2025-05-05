import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import Head from 'next/head';
import { useEffect, useState } from "react";

const Index = () => {
    const [user, setUser] = useState(null);
    const [bookingData, setBookingData] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('th-TH', {
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
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(price);
    };

    useEffect(() => {
        const userData = localStorage.getItem("users");
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (e) {
                console.error("Error parsing user data:", e);
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้");
            }
        } else {
            setError("กรุณาเข้าสู่ระบบก่อนดูประวัติการจอง");
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user?.id) return;
            
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/getByCustomerID/${user.id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBookingData(data.data || data);
            } catch (e) {
                console.error("Error fetching bookings:", e);
                setError("ไม่สามารถโหลดข้อมูลการจองได้ กรุณาลองใหม่อีกครั้ง");
            }
            setLoading(false);
        };

        fetchBookings();
    }, [user]);

    const getStatusText = (status) => {
        switch (status) {
            case 'Confirmed':
                return <span className="text-green-600">ชำระเงินสำเร็จ</span>;
            case 'Pending':
                return <span className="text-yellow-600">รอชำระเงิน</span>;
            default:
                return <span className="text-red-600">ไม่สำเร็จ</span>;
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <span className="ml-2">กำลังโหลดข้อมูล...</span>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg shadow">
                        <span className="font-medium">{error}</span>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head>
                <title>การทำรายการ | My Hotel</title>
            </Head>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-semibold text-gray-800 my-4 text-center">การทำรายการ</h1>
                <div className="relative overflow-x-auto border sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center">Booking ID</th>
                                <th scope="col" className="px-6 py-3 text-center">ห้องหมายเลข</th>
                                <th scope="col" className="px-6 py-3 text-center">วันที่เข้าพัก</th>
                                <th scope="col" className="px-6 py-3 text-center">วันที่ออก</th>
                                <th scope="col" className="px-6 py-3 text-center">วันที่ทำรายการ</th>
                                <th scope="col" className="px-6 py-3 text-center">ราคา</th>
                                <th scope="col" className="px-6 py-3 text-center">สถานะ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookingData.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500 bg-gray-50">
                                        ไม่พบประวัติการจอง
                                    </td>
                                </tr>
                            ) : (
                                bookingData.map((booking, index) => (
                                    <tr key={booking.BookingID || index} className="bg-white border-b hover:bg-gray-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {booking.BookingID}
                                        </th>
                                        <td className="px-6 py-4 text-center">{booking.RoomID}</td>
                                        <td className="px-6 py-4 text-center">{formatDate(booking.CheckInDate)}</td>
                                        <td className="px-6 py-4 text-center">{formatDate(booking.CheckOutDate)}</td>
                                        <td className="px-6 py-4 text-center">{formatDate(booking.BookingDate)}</td>
                                        <td className="px-6 py-4 text-center">{formatPrice(booking.TotalPrice)}</td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusText(booking.Status)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
};

export default Index;