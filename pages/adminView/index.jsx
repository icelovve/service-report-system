import AdminLayout from '@/pages/components/layouts/AdminLayout';
import Head from 'next/head';
import React, { useEffect, useState } from "react";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import ColumnChart from '../components/share/ColumnChart';
import PieChart from '../components/share/PieChart'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [room, setRoom] = useState([]);
    const [roomData, setRoomData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataPie, setDataPie] = useState({
        labels: ['Available Room', 'Unavailable Room'],
        datasets: [{
            label: 'Room Status',
            data: [0, 0],
            hoverOffset: 4,
        }]
    });
    const [dataBar, setDataBar] = useState({
        labels: ['Standard', 'Deluxe', 'Suite', 'Penthouse'],
        datasets: [{
            label: 'Total Profit by Room Type',
            data: [0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 13, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgb(255, 99, 13)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(54, 162, 235)',
            ],
            borderWidth: 1
        }]
    });

    const roomTypeMapping = {
        1: 'Standard',
        2: 'Deluxe',
        3: 'Suite',
        4: 'Penthouse'
    };

    useEffect(() => {
        const fetchData = async () => { 
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings`);
                const result = await response.json();  
                setData(result?.data || result); 
            } catch (err) { 
                console.error('Error fetching bookings:', err); 
                setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rooms`);
                const result = await response.json();
                setRoom(result?.data || result);
            } catch (err) {
                console.error('Error fetching room:', err);
                setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
            }
        }
        fetchRoom();
    }, []); 

    useEffect(() => {
        if (room.length) {
            const available = availableRoom(room);
            const unavailable = unavailableRoom(room);
            setDataPie({
                labels: ['Available Room', 'Unavailable Room'],
                datasets: [{
                    label: 'Room Status',
                    data: [available, unavailable],
                    backgroundColor: [
                        'rgb(54, 162, 235)',
                        'rgb(255, 99, 132)',
                    ],
                    hoverOffset: 4,
                }]
            });
        }
    }, [room]);

    useEffect(() => {
        if (data.length && room.length) {
            groupTotalPriceByRoomType();
        }
    }, [data, room]);
    
    const totalSales = () => {
        if (!Array.isArray(data)) return 0;
        return data.reduce((sum, item) => {
            const price = parseFloat(item.TotalPrice.replace(/,/g, '')) || 0;
            return sum + price;
        }, 0);
    }

    const availableRoom = (rooms) => {
        if (!rooms || !Array.isArray(rooms)) return 0;
        return rooms.reduce((sum, room) => room.Status === "Available" ? sum + 1 : sum, 0);
    }

    const unavailableRoom = (rooms) => {
        if (!rooms || !Array.isArray(rooms)) return 0;
        return rooms.reduce((sum, room) => room.Status === "Unavailable" ? sum + 1 : sum, 0);
    }

    const groupTotalPriceByRoomType = () => {
        const mergedData = data.map(booking => {
            const roomDetails = room.find(r => r.RoomID === booking.RoomID);
            return {
                ...booking,
                RoomTypeID: roomDetails ? roomDetails.RoomTypeID : null 
            };
        });
    
        const groupedData = mergedData.reduce((acc, booking) => {
            const roomTypeID = booking.RoomTypeID;
            const totalPrice = parseFloat(booking.TotalPrice) || 0;
    
            if (roomTypeID) {
                if (!acc[roomTypeID]) {
                    acc[roomTypeID] = {
                        RoomTypeID: roomTypeID,
                        RoomTypeName: roomTypeMapping[roomTypeID] || 'Unknown',
                        TotalPriceSum: 0,
                        Bookings: []
                    };
                }
                acc[roomTypeID].TotalPriceSum += totalPrice; 
                acc[roomTypeID].Bookings.push(booking);
            }
    
            return acc;
        }, {});
    
        const result = Object.values(groupedData);
        setRoomData(result)

        const barData = [1, 2, 3, 4].map(typeId => {
            const roomData = result.find(item => item.RoomTypeID === typeId);
            return roomData ? roomData.TotalPriceSum : 0;
        });

        setDataBar(prev => ({
            ...prev,
            datasets: [{
                ...prev.datasets[0],
                data: barData
            }]
        }));
        // console.log('result -->', result); 
        return result;
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
                <title>Admin - Dashboard</title>
                <meta name='description' content='Admin Dashboard Page' />
            </Head>
            <div className="col col-auto mt-4 mx-4">
                <h1 className="font-bold text-xl text-center">Dashboard</h1>
                <div className="mt-12 flex justify-between">
                    <div className="w-1/3 h-32 bg-white border p-6 rounded-md shadow-md mx-4">
                        <span className='text-xl font-semibold text-gray-600 mt-2 flex items-center '>
                            Total Sales
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="currentColor" 
                                className="size-6 ml-2"
                            >
                                <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                                <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clipRule="evenodd" />
                                <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
                            </svg>
                        </span>
                        <p className='text-3xl font-semibold text-yellow-600 mt-4'>
                            {totalSales().toLocaleString('th-TH', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </p>
                    </div>
                    <div className="w-1/3 h-32 bg-white border p-6 rounded-md shadow-md mx-4">
                        <span className='text-xl font-semibold text-gray-600 mt-2 flex items-center'>
                            Available Room
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24"
                                className="size-6 ml-2"
                                fill="currentColor" 

                            > 
                                <path 
                                    d="M2 2h14v4h6v16H2V2zm18 6h-4v2h2v2h-2v2h2v2h-2v2h2v2h2V8zm-6-4H4v16h2v-2h6v2h2V4zM6 6h2v2H6V6zm6 0h-2v2h2V6zm-6 4h2v2H6v-2zm6 0h-2v2h2v-2zm-6 4h2v2H6v-2zm6 0h-2v2h2v-2z" 
                                    fill="currentColor"
                            /> 
                            </svg>
                        </span>
                        <p className='text-3xl font-semibold text-green-600 mt-4'>
                            {availableRoom(room)}
                        </p>
                    </div>
                    <div className="w-1/3 h-32 bg-white border p-6 rounded-md shadow-md mx-4">
                        <span className='text-xl font-semibold text-gray-600 mt-2 flex items-center'>
                            Unavailable Room
                            <svg 
                                className="size-6 ml-2"
                                fill="currentColor"                                 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24"
                            > 
                                <path 
                                    d="M17 2h-2v2H9V2H7v2H3v18h18V4h-4V2zM7 6h12v2H5V6h2zM5 20V10h14v10H5zm6-4H9v2h2v-2zm0-2v-2H9v2h2zm2 0h-2v2h2v2h2v-2h-2v-2zm0 0v-2h2v2h-2z" 
                                    fill="currentColor"
                                /> 
                            </svg>
                        </span>
                        <p className='text-3xl font-semibold text-red-600 mt-4'>
                            {unavailableRoom(room)}
                        </p>
                    </div>
                </div>
                <div className="mt-8 flex justify-between">
                    <div className="w-2/3 h-full bg-white border p-6 rounded-md shadow-md mx-4" style={{ maxWidth: '370px', maxHeight: '370px' }}>
                        <PieChart 
                            available = {availableRoom(room)}
                            unavailable = {unavailableRoom(room)}
                        />
                        {/* <Pie data={dataPie} /> */}
                    </div>
                    <div className="w-2/3 h-full bg-white border p-6 rounded-md shadow-md mx-4" style={{ maxWidth: '1000px', maxHeight: '800px' }}>
                        <ColumnChart roomData={roomData} />
                    </div>
                </div>
                <div className="mt-8 flex justify-between">
                    
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;