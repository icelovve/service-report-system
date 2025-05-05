import { useState, useEffect } from 'react';
import Script from 'next/script';

const PayWithCreditCard = ({ total, customerId, createCreditCard }) => {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [OmiseCard, setOmiseCard] = useState(null);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleLoadScript = () => {
        if (window.OmiseCard) {
            setOmiseCard(window.OmiseCard);
            window.OmiseCard.configure({
                publicKey: 'pkey_test_61v0z3i9yp7fkkgn5ow',
                currency: 'THB',
                frameLabel: 'My Hotel',
                submitLabel: 'ชำระเงิน',
                buttonLabel: 'Pay with Omise'
            });
            setIsScriptLoaded(true);
        }
    };

    const creditCardConfigure = () => {
        if (!OmiseCard) {
            setError('ระบบชำระเงินยังไม่พร้อมใช้งาน กรุณาลองใหม่อีกครั้ง');
            return;
        }
        OmiseCard.configure({
            defaultPaymentMethod: 'credit_card',
            otherPaymentMethods: []
        });
    };

    const omiseCardHandler = () => {
        setIsProcessing(true);
        setError('');

        OmiseCard.open({
            amount: Math.round(total * 100),
            onCreateTokenSuccess: async (token) => {
                try {
                    console.log("Token Created:", token);
                    await createCreditCard(token);
                } catch (err) {
                    setError('เกิดข้อผิดพลาดในการชำระเงิน กรุณาลองใหม่อีกครั้ง');
                } finally {
                    setIsProcessing(false);
                }
            },
            onFormClosed: () => {
                setIsProcessing(false);
            }
        });
    };

    const handleClick = (e) => {
        e.preventDefault();
        if (!isScriptLoaded || !OmiseCard) {
            setError('กรุณารอสักครู่ ระบบกำลังโหลด');
            return;
        }
        creditCardConfigure();
        omiseCardHandler();
    };

    return (
        <div className="space-y-4">
            <Script
                src="https://cdn.omise.co/omise.js"
                onLoad={handleLoadScript}
                onError={() => setError('ไม่สามารถโหลดระบบชำระเงินได้')}
            />

            <button
                id="credit-card"
                type="button"
                disabled={isProcessing || !isScriptLoaded}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-yellow-700 border-2 border-yellow-700 rounded-lg hover:bg-yellow-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleClick}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                >
                    <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                    <path
                        fillRule="evenodd"
                        d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z"
                        clipRule="evenodd"
                    />
                </svg>
                {isProcessing ? 'กำลังดำเนินการ...' : 'ชำระด้วยบัตรเครดิต'}
            </button>
        </div>
    );
};

export default PayWithCreditCard;