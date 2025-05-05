import Omise from 'omise';
import omiseConfig from '../../../config/omiseConfig';

const omiseClient = Omise(omiseConfig);

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { RoomID, customerId, total, token } = req.body;

    if (!customerId || !total || !token) {
        return res.status(400).json({
            message: "Missing required fields",
        });
    }

    try {
        const amountInCents = Math.round(total * 100);

        // สร้างลูกค้าใหม่ด้วยข้อมูลบัตรเครดิต
        const customer = await omiseClient.customers.create({
            description: `Customer ID: ${customerId}`,
            card: token,
        });

        // สร้างคำขอการชำระเงิน
        const charge = await omiseClient.charges.create({
            description: `Customer ID: ${customerId}`,
            amount: amountInCents,
            currency: "THB",
            customer: customer.id,
            capture: true,
            metadata: {
                customerId,
                totalAmount: total,
            },
        });

        return res.status(200).json({
            success: true,
            chargeId: charge.id,
            amount: charge.amount,
            status: charge.status,
        });
    } catch (error) {
        console.error("Payment processing error:", error);

        return res.status(500).json({
            success: false,
            message: "Payment processing failed",
            error: error.message,
        });
    }
}
