import mysql from 'mysql2/promise';
import connectionConfig from '../../../config/dbConfig';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const generateCustomerId = (length = 10) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    try {
        const { FullName, Email, Phone } = req.body;

        // สร้าง CustomerID ใหม่ที่เป็นรหัสลูกค้าปลอม
        const CustomerID = generateCustomerId();

        const connection = await mysql.createConnection(connectionConfig);

        const sql = "INSERT INTO customers (CustomerID, FullName, Email, Phone) VALUES (?, ?, ?, ?)";
        const values = [CustomerID, FullName, Email, Phone];

        const [result] = await connection.execute(sql, values);
        console.log('result:', result);

        await connection.end();

        res.status(201).json({
            message: 'เพิ่มข้อมูลลูกค้าสำเร็จ',
            CustomerID: CustomerID  
        });

    } catch (e) {
        return res.status(500).json({
            message: 'การ query ฐานข้อมูลล้มเหลว',
            error: e.message
        });
    }
}
