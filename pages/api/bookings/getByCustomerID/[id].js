import mysql from 'mysql2/promise';
import connectionConfig from '../../../../config/dbConfig';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'ต้องระบุ CustomerID' });
    }

    try {
        const connection = await mysql.createConnection(connectionConfig);
        const [rows] = await connection.query('SELECT * FROM bookings WHERE CustomerID = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'ไม่พบรหัสการจองที่ตรงกับ CustomerID' });
        }

        res.status(200).json({
            message: 'ดึงข้อมูลสำเร็จ',
            data: rows
        });

        await connection.end();

    } catch (err) {
        return res.status(500).json({
            message: 'การ query ฐานข้อมูลล้มเหลว',
            error: err.message
        });
    }
}
