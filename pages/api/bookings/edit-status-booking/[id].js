import mysql from 'mysql2/promise';
import connectionConfig from '../../../../config/dbConfig';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: "ไม่พบ ID" });
    }

    let connection; 

    try {
        const { Status } = req.body;

        if (!Status) {
            return res.status(400).json({ message: "ไม่พบสถานะการจอง" });
        }

        const sql = "UPDATE bookings SET Status = ? WHERE BookingID = ?";
        connection = await mysql.createConnection(connectionConfig);

        await connection.query(sql, [Status, id]);
        res.status(200).json({ message: "อัปเดตสถานะการจองสำเร็จ" });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล" });
    } finally {
        if (connection) {
            connection.end();
        }
    }
}
