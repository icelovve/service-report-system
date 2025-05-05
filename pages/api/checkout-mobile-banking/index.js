import Omise from 'omise';
import omiseConfig from '../../../config/omiseConfig';

const omiseClient = Omise(omiseConfig);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { RoomID, customerId, total, token } = req.body;

    if (!customerId || !total || !token) {
        return res.status(400).json({
            message: "กรุณากรอกข้อมูลให้ครบถ้วน",
        });
    }

    try {
        // สร้าง charge ใน Omise
        const charge = await omiseClient.charges.create({
            description: `Room ID: ${RoomID}, Customer ID: ${customerId}`,
            amount: Math.round(total * 100), 
            currency: 'THB',
            return_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
            source: token
        });

        return res.status(200).json({
            success: true,
            chargeId: charge.id,
            amount: charge.amount,
            status: charge.status,
            authorizeUri: charge.authorize_uri 
        });
    } catch (error) {
        console.error("Payment processing error:", error);
        
        return res.status(500).json({
            success: false,
            message: "การชำระเงินล้มเหลว กรุณาลองใหม่อีกครั้ง",
            error: error.message,
        });
    }
}