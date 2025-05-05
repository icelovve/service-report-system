import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import connectionConfig from '../../../config/dbConfig';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;

        // ตรวจสอบว่าได้รับอีเมลมาไหม
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        const connection = await mysql.createConnection(connectionConfig);

        // ค้นหาผู้ใช้ตามอีเมล
        const sql = "SELECT * FROM users WHERE email = ?";
        const [result] = await connection.execute(sql, [email]);

        // ถ้าพบผู้ใช้
        if (result.length > 0) {
            const user = result[0];

            // ตรวจสอบรหัสผ่าน
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (isPasswordMatch) {
                return res.status(200).json({
                    message: 'Login successful',
                    users: {
                        id: user.user_id,
                        name: user.first_name + ' ' + user.last_name,
                        // email: user.email,
                        // phone_number: user.phone_number,
                        role:user.role
                    }
                });
            } else {
                return res.status(401).json({
                    error: "Login failed",
                    message: "Invalid password"
                });
            }
        } else {
            return res.status(401).json({
                message: "Invalid email"
            });
        }
    } catch (error) {
        console.error('Error in /login:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message,
        });
    }
}