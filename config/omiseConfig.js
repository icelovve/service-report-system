import dotenv from 'dotenv';
dotenv.config();

const omiseConfig = {
    publicKey: process.env.OMISE_PUBLIC_KEY,
    secretKey: process.env.OMISE_SECRET_KEY,
};

export default omiseConfig;