import mysql from 'mysql2/promise';
import connectionConfig from '../../../../config/dbConfig';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;
    const { first_name, last_name, email, phone_number } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'ต้องระบุ user_id' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(connectionConfig);
        const sql = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ? WHERE user_id = ?';
        const values = [first_name, last_name, email, phone_number, id];
        const [result] = await connection.query(sql, values);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'อัปเดตสำเร็จ' });
        } else {
            return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการอัปเดต หรือไม่มีการเปลี่ยนแปลง' });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้',
            error: error.message,
        });
    } finally {
        if (connection) {
            await connection.end(); 
        }
    }
}
