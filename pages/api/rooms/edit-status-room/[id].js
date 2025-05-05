import mysql from 'mysql2/promise';
import connectionConfig from '../../../../config/dbConfig';

export default async function handler(req, res, next) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: "ไม่พบ ID" });
    }

    let connection; 

    try{
        const { Status } = req.body;

        if (!Status) {
            return res.status(400).json({ message: "ไม่พบสถานะ" });
        }

        const sql = "UPDATE rooms SET Status = ? WHERE RoomID = ?";
        connection = await mysql.createConnection(connectionConfig);

        await connection.query(sql, [Status, id]);
        res.status(200).json({ message: "อัปเดตสถานะสำเร็จ" });

    }catch(err){
        return res.status(500).json({
            message: 'การ query ��านข้อมูลล้มเหลว',
            error: err.message
        });
    }finally{
        if (connection) {
            connection.end();
        }
    }
}