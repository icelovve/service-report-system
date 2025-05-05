import mysql from 'mysql2/promise';
import connectionConfig from '../../../config/dbConfig';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const connection = await mysql.createConnection(connectionConfig);
        const [rows] = await connection.query('SELECT * FROM rooms');
        
        res.status(200).json({
            message: 'Data retrieved successfully',
            data: rows
        });

        await connection.end();

    }catch(err){
        return res.status(500).json({
            message: 'Database query failed',
            error: err.message
        });
    }
}