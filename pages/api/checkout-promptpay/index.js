import Omise from 'omise';
import omiseConfig from '../../../config/omiseConfig';

const omiseClient = Omise(omiseConfig);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, total } = req.body;

    try {
        const source = await omiseClient.sources.create({
            type: 'promptpay',
            amount: Math.round(total * 100),
            currency: 'THB',
        });

        const charge = await omiseClient.charges.create({
            description: name,
            amount: Math.round(total * 100),
            currency: 'THB',
            return_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
            source: source.id
        });

        res.status(200).send({
            amount: charge.amount,
            authorizeUri: charge.authorize_uri,
            source: source 
        });

        console.log('Charge created:', charge);
    } catch (error) {
        console.error('Error in payment processing:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message,
        });
    }
}