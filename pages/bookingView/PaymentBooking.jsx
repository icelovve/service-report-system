import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../components/layouts/MainLayout";
import Head from "next/head";
import PayWithCreditCard  from "../components/share/PayWithCreditCard";
import { PayWithMobileBanking } from "../components/share/PayWithMobileBanking";

const PaymentBooking = () => {
    const router = useRouter();
    const [bookingData, setBookingData] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (router.isReady && router.query.bookingData) {
            try {
                const decodedData = JSON.parse(decodeURIComponent(router.query.bookingData));
                setBookingData(decodedData);
            } catch (error) {
                console.error("Error parsing booking data:", error);
            }
        }
    }, [router.isReady, router.query.bookingData]);
    
    useEffect(() => {
        if (bookingData) {
            setTotal(parseFloat(bookingData.TotalPrice) - discount);
        }
    }, [bookingData, discount]);

    // const applyPromoCode = () => {
    //     const discountValue = 50;
    //     setDiscount(discountValue);
    //     setTotal((prevTotal) => prevTotal - discountValue);
    // };

    const confirmedBooking = async () => {
        const bookingID = bookingData.BookingID;    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/edit-status-booking/${bookingID}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Status: "Confirmed", 
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || response.statusText);
            }
    
            console.log('Booking status updated successfully:', data);
    
        } catch (err) {
            console.error('Error confirming booking:', err);
        }
    };    

    const updateStatusRoom = async() =>{
        const roomId = bookingData.RoomID;  
        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/rooms/edit-status-room/${roomId}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Status: "Unavailable", 
                })
            })

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || response.statusText);
            }
    
            console.log('Room status updated successfully:', data);

        }catch(e){
            console.error("Error updating room status:", e);
        }
    }

    const paymentSuccess = () => {
        router.push({
            pathname: '/payment-success',
            query: { bookingData: encodeURIComponent(JSON.stringify(bookingData)) }
        });
    }

    const createCreditCard = async (token) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout-creditcard`, {
                method: 'POST',
                body: JSON.stringify({
                    token,
                    customerId: bookingData.CustomerID,
                    RoomID: bookingData.RoomID,
                    total,
                    
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (res.ok) {
                console.log("Payment successful!");
                confirmedBooking();
                updateStatusRoom();
                paymentSuccess();
            } else {
                const errorData = await res.json();
                console.error("การชำระเงินล้มเหลว :", errorData.message);
            }
        } catch (e) {
            console.error("เกิดข้อผิดพลาดในการชำระเงิน :", e);
        }
    };
    
    const createMobileBanking = async (token) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/checkout-mobile-banking`, {
                method: 'POST',
                body: JSON.stringify({
                    token,
                    customerId: bookingData.CustomerID,
                    RoomID: bookingData.RoomID,
                    total,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await res.json();
    
            if (res.ok) {
                console.log("Payment successful!");
                await confirmedBooking();
                await updateStatusRoom();
                
                if (data.authorizeUri) {
                    window.location.href = data.authorizeUri;
                } else {
                    throw new Error('ไม่พบลิงก์สำหรับชำระเงิน');
                }
            } else {
                throw new Error(data.message || 'การชำระเงินล้มเหลว');
            }
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการชำระเงิน:', error);
            throw error; 
        }
    };
    
    return (
        <MainLayout>
            <Head>
                <title>ชำระเงิน | My Hotel</title>
            </Head>
            {bookingData ? (
                <div className="max-w-6xl mx-auto p-6 mt-6 grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl border p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">รายการ</h2>

                        <div className="bg-gray-50 border rounded-lg p-6 mb-6 space-y-4">
                            <h3 className="font-bold text-gray-800">รหัสลูกค้า {bookingData.CustomerID}</h3>
                            <p className="text-gray-600">ห้อง {bookingData.RoomID}</p>
                            <p className="text-gray-600">วันที่เข้าพัก {bookingData.CheckInDate}</p>
                            <p className="text-gray-600">วันที่ออก {bookingData.CheckOutDate}</p>
                        </div>

                        <div className="flex gap-2 mb-8">
                            <input
                                type="text"
                                placeholder="โค้ดส่วนลด"
                                className="flex-1 px-4 py-3 rounded-lg border focus:ring-2 focus:ring-yellow-600"
                            />
                            <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                                ใช้ส่วนลด
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-600">
                                <span>ส่วนลด</span>
                                <span>฿{discount}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>ราคาห้องพัก</span>
                                <span>฿{bookingData.TotalPrice}</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t">
                                <span className="font-bold">รวมทั้งหมด</span>
                                <span className="text-xl font-bold text-red-600">฿{total}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">ชำระเงิน</h2>
                        <PayWithCreditCard 
                            total={total}
                            roomId={bookingData.RoomID}
                            customerId={bookingData.CustomerID}
                            createCreditCard={createCreditCard}
                        />
                        <PayWithMobileBanking 
                            total={total}
                            roomId={bookingData.RoomID}
                            customerId={bookingData.CustomerID}
                            createMobileBanking={createMobileBanking}
                        />
                    </div>
                </div>
            ) : (
                <p className="text-center mt-12">Loading booking data...</p>
            )}
        </MainLayout>
    );
};

export default PaymentBooking;