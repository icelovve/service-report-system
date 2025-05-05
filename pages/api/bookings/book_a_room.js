import mysql from 'mysql2/promise';
import connectionConfig from '../../../config/dbConfig';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // ฟังก์ชันสำหรับสุ่ม 15 หลัก
    const generateBookingID = (length = 15) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    try {
        const { CustomerID, RoomID, CheckInDate, CheckOutDate, BookingDate, TotalPrice, Status } = req.body;
        
        const formattedCheckInDate = new Date(CheckInDate).toISOString().split('T')[0];
        const formattedCheckOutDate = new Date(CheckOutDate).toISOString().split('T')[0];
        const formattedBookingDate = new Date(BookingDate).toISOString().split('T')[0];

        // สร้าง BookingID ใหม่ (สุ่ม 15 หลัก)
        const BookingID = generateBookingID();

        const connection = await mysql.createConnection(connectionConfig);
        const sql = "INSERT INTO Bookings (BookingID, CustomerID, RoomID, CheckInDate, CheckOutDate, BookingDate, TotalPrice, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [BookingID, CustomerID, RoomID, formattedCheckInDate, formattedCheckOutDate, formattedBookingDate, TotalPrice, Status];

        const [result] = await connection.execute(sql, values);
        console.log('result:', result);
        
        await connection.end();

        // ส่งการตอบกลับสำเร็จ
        res.status(201).json({
            message: 'เพิ่มข้อมูลการจองสำเร็จ',
            BookingID: BookingID
        });

    } catch (e) {
        return res.status(500).json({
            message: 'การ query ฐานข้อมูลล้มเหลว',
            error: e.message
        });
    }
}
