import mysql from 'mysql2/promise';
import connectionConfig from '../../../../config/dbConfig';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'ต้องระบุ user_id' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(connectionConfig);

        const sql = 'DELETE FROM users WHERE user_id = ?';
        const [result] = await connection.query(sql, [id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'ลบข้อมูลสำเร็จ' });
        } else {
            return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการลบ' });
        }

    } catch (err) {
        return res.status(500).json({
            message: 'การ query ฐานข้อมูลล้มเหลว',
            error: err.message
        });
    } finally {
        if (connection) {
            await connection.end();  
        }
    }
}