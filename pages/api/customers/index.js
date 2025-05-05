import mysql from 'mysql2/promise';
import connectionConfig from '../../../config/dbConfig';

export default async function handler(req, res) {
    if (req.method!== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try{
        const connection = await mysql.createConnection(connectionConfig);
        const [rows] = await connection.query('SELECT * FROM customers');

        res.status(200).json({
            message: 'ดึงข้อมูลสำเร็จ',
            data: rows
        });

        await connection.end();
    }catch(e){
        return res.status(500).json({
            message: 'การ query ฐานข้อมูลล้มเหลว',
            error: e.message
        });
    }
}