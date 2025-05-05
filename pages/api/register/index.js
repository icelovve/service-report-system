import bcrypt from 'bcryptjs'; 
import mysql from 'mysql2/promise';
import crypto from 'crypto';
import connectionConfig from '../../../config/dbConfig';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const generateEncryptedUserId = () => {
        return crypto.randomBytes(8).toString('hex'); // สร้าง ID แบบสุ่ม 16 ตัวอักษร
    };

    try {
        const { first_name, last_name, email, password, phone_number } = req.body;

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);

        // เชื่อมต่อกับฐานข้อมูล
        const connection = await mysql.createConnection(connectionConfig);

        // สร้าง ID แบบเข้ารหัส
        const userId = generateEncryptedUserId();

        // SQL สำหรับเพิ่มข้อมูลผู้ใช้
        const sql = `
            INSERT INTO users (user_id, first_name, last_name, email, password, phone_number, role) 
            VALUES (?, ?, ?, ?, ?, ?, 'user')
        `;
        const values = [userId, first_name, last_name, email, hashedPassword, phone_number];

        const [result] = await connection.execute(sql, values);

        // ปิดการเชื่อมต่อ
        await connection.end();

        // ตอบกลับเมื่อสำเร็จ
        res.status(201).json({
            message: 'User registered successfully',
            userId: userId,
        });
    } catch (error) {
        console.error('Error in /register:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message,
        });
    }
}
