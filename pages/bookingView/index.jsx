import { useEffect, useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import { useRouter } from "next/router";
import Head from "next/head";
import Swal from 'sweetalert2'

const index = () => {
    const [user, setUser] = useState('');
    const [rooms, setRooms] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split("T")[0]);
    const [checkOutDate, setCheckOutDate] = useState(new Date().toISOString().split("T")[0]);
    const [roomType, setRoomType] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [roomPrice, setRoomPrice] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const router = useRouter();
    
    const minCheckInDate = new Date().toISOString().split("T")[0];
    const minCheckOutDate = checkInDate ? new Date(checkInDate).toISOString().split("T")[0] : minCheckInDate;    

    // const checkAuthentication = () => { 
    //     const isLoggedIn = localStorage.getItem("isLoggedIn"); 
    //     setIsAuthenticated(isLoggedIn === true);
    // }

    // useEffect(() => {
    //     checkAuthentication();
    // }, []);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        setIsAuthenticated(isLoggedIn === "true");
    }, []);

    // console.log('isAuthenticated -->',isAuthenticated);
    
    useEffect(() => {
        const userData = localStorage.getItem("users");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
        } else {
            console.log("No user data found in localStorage.");
        }
    }, []);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rooms`);
                const data = await response.json();
                setRooms(data.data || data);
            } catch (error) {
                console.error("Error fetching rooms:", error);
                setError("ไม่สามารถโหลดข้อมูลห้องพักได้ กรุณาลองใหม่อีกครั้ง");
            } finally {
                setLoading(false);
            }
        };
        fetchRooms();
    }, []);

    useEffect(() => {
        if (checkInDate && checkOutDate && roomPrice) {
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            setTotalPrice(nights * roomPrice);
        }
    }, [checkInDate, checkOutDate, roomPrice]);

    
    const handleRoomChange = (e) => {
        const selectedRoomNumber = e.target.value;
        setRoomNumber(selectedRoomNumber);
        
        const selectedRoom = rooms.find(room => room.RoomNumber === selectedRoomNumber);
        if (selectedRoom) {
            setRoomPrice(selectedRoom.PricePerNight);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            Swal.fire({
                icon: "warning",
                text: "กรุณาเข้าสู่ระบบก่อนทำการจองห้องพัก",
                showConfirmButton: false,
                timer: 2000,
            });
            router.push("/loginView");
            return;
        } else {
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            const diffTime = checkOut - checkIn;
            const diffDays = diffTime / (1000 * 60 * 60 * 24); 
    
            if (diffDays <= 0) {
                Swal.fire({
                    icon: "warning",
                    text: "กรุณาเลือกวันที่เช็คเอ้าท์มากกว่าวันที่เช็คอินอย่างน้อย 1 วัน",
                    showConfirmButton: false,
                    timer: 2000,
                });
                return;
            }
    
            if (totalPrice > 150000) {
                Swal.fire({
                    icon: "warning",
                    text: "กรุณาทำรายการที่ต่ำกว่า 150000",
                    showConfirmButton: false,
                    timer: 2000,
                });
            } else {
                const bookingData = {
                    CustomerID: user.id,
                    RoomID: parseInt(roomNumber),
                    CheckInDate: checkInDate,
                    CheckOutDate: checkOutDate,
                    BookingDate: new Date().toISOString().split("T")[0],
                    TotalPrice: totalPrice,
                    Status: "Pending",
                };
    
                try {
                    const response = await fetch('/api/bookings/book_a_room', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(bookingData),
                    });
    
                    const data = await response.json();
    
                    if (!response.ok) {
                        throw new Error(data.message || response.statusText);
                    }
    
                    const bookingID = data.BookingID;
                    bookingData.BookingID = bookingID;
    
                    router.push({
                        pathname: '/bookingView/PaymentBooking',
                        query: { bookingData: encodeURIComponent(JSON.stringify(bookingData)) }
                    });
                } catch (error) {
                    console.error("Booking error:", error);
                    alert("การจองห้องพักล้มเหลว กรุณาลองใหม่อีกครั้ง");
                }
            }
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
        
    //     const checkIn = new Date(checkInDate);
    //     const checkOut = new Date(checkOutDate);
    //     const diffTime = checkOut - checkIn;
    //     const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
    //     if (diffDays <= 0) {
    //         Swal.fire({
    //             icon: "warning",
    //             text: "กรุณาเลือกวันที่เช็คเอ้าท์มากกว่าวันที่เช็คอินอย่างน้อย 1 วัน",
    //             showConfirmButton: false,
    //             timer: 2000,
    //         });
    //         return;
    //     }
        
    //     if (totalPrice > 150000) {
    //         Swal.fire({
    //             icon: "warning",
    //             text: "กรุณาทำรายการที่ต่ำกว่า 150000",
    //             showConfirmButton: false,
    //             timer: 2000,
    //         });
    //         return;
    //     }
    
    //     const bookingData = {
    //         CustomerID: user.id,
    //         RoomID: parseInt(roomNumber),
    //         CheckInDate: checkInDate,
    //         CheckOutDate: checkOutDate,
    //         BookingDate: new Date().toISOString().split("T")[0],
    //         TotalPrice: totalPrice,
    //         Status: "Pending",
    //     };
        
    //     try {
    //         const response = await fetch('/api/bookings/book_a_room', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(bookingData),
    //         });
            
    //         const data = await response.json();
            
    //         if (!response.ok) {
    //             throw new Error(data.message || response.statusText);
    //         }
            
    //         const bookingID = data.BookingID;
    //         bookingData.BookingID = bookingID;
            
    //         router.push({
    //             pathname: '/bookingView/PaymentBooking',
    //             query: { bookingData: encodeURIComponent(JSON.stringify(bookingData)) }
    //         });
    //     } catch (error) {
    //         console.error("Booking error:", error);
    //         alert("การจองห้องพักล้มเหลว กรุณาลองใหม่อีกครั้ง");
    //     }
    // };
    
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
        <MainLayout className="container mx-auto px-4 py-8">
            <Head>
                <title>จองห้องพัก | My Hotel</title>
            </Head>
            <form onSubmit={handleSubmit} className="space-y-4 mt-16 mx-auto max-w-md bg-white rounded-xl border p-8 shadow-md">
            <h1 className="text-2xl font-semibold text-gray-800 my-4 text-center">ห้องพักทั้งหมด</h1>
                <div>
                    <label htmlFor="check-in" className="block text-sm font-medium text-gray-700">วันที่เข้าพัก</label>
                    <input
                        type="date"
                        id="check-in"
                        value={checkInDate}
                        min={minCheckInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="check-out" className="block text-sm font-medium text-gray-700">วันที่เช็คเอาต์</label>
                    <input
                        type="date"
                        id="check-out"
                        value={checkOutDate}
                        min={minCheckOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="room-type" className="block text-sm font-medium text-gray-700">เลือกห้องพัก</label>
                    <select
                        id="room-type"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                        required
                    >
                        <option value="">เลือกห้องพัก</option>
                        {rooms
                            .filter((room, index, self) =>
                                index === self.findIndex((r) => r.RoomTypeID === room.RoomTypeID)
                            )
                            .sort((a, b) => a.RoomTypeID - b.RoomTypeID)
                            .map((room) => (
                                <option key={room.RoomTypeID} value={room.RoomTypeID}>
                                    {room.RoomTypeID === 1 ? 'ห้องมาตรฐาน' :
                                        room.RoomTypeID === 2 ? 'ห้องพักหรูหรา' :
                                            room.RoomTypeID === 3 ? 'ห้องสำหรับครอบครัว' :
                                                room.RoomTypeID === 4 ? 'ห้องพักระดับพรีเมียม' : ''}
                                </option>
                            ))}
                    </select>
                </div>

                <div className="flex justify-center items-center">
                    <div className="w-full mr-1">
                        <label htmlFor="room-number" className="block text-sm font-medium text-gray-700">เลือกหมายเลขห้องพัก</label>
                        <select
                            id="room-number"
                            value={roomNumber}
                            onChange={handleRoomChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                            required
                        >
                            <option value="">เลือกหมายเลขห้องพัก</option>
                            {rooms
                                .filter(room => room.RoomTypeID === parseInt(roomType))
                                .sort((a, b) => a.RoomNumber - b.RoomNumber)
                                .map((room) => (
                                    <option key={room.RoomNumber} value={room.RoomNumber}>
                                        {`ห้อง ${room.RoomNumber}`}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="w-full ml-1 mt-5">
                        {roomPrice && (
                            <div className="mt-1 block w-full px-3 py-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    ราคาต่อคืน: {roomPrice} บาท
                                </label>
                                {totalPrice > 0 && (
                                    <label className="block text-sm font-medium text-gray-700 mt-1">
                                        ราคารวม: {totalPrice} บาท
                                    </label>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                    disabled={loading || !user || !roomType || !roomNumber}
                >
                    จองห้องพัก
                </button>
            </form>
        </MainLayout>
    );
};

export default index;