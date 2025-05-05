import { useState, useEffect } from 'react';
import Script from 'next/script';

export const PayWithMobileBanking = ({ total, createMobileBanking, customerId }) => {
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
            defaultPaymentMethod: 'mobile_banking',
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
                    console.log('Token created:', token);
                    await createMobileBanking(token);
                } catch (error) {
                    console.error('Payment creation failed:', error);
                    setError('การชำระเงินล้มเหลว กรุณาลองใหม่อีกครั้ง');
                } finally {
                    setIsProcessing(false);
                }
            },
            onFormClosed: () => {
                console.log('Payment form closed.');
                setIsProcessing(false);
            },
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
        <div className="space-y-4 mt-4">
            <Script
                src="https://cdn.omise.co/omise.js"
                onLoad={handleLoadScript}
                onError={() => setError('ไม่สามารถโหลดระบบชำระเงินได้')}
            />

            {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            <button
                id="mobile-banking"
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
                    <path d="M10.5 18.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
                    <path fillRule="evenodd" d="M8.625.75A3.375 3.375 0 0 0 5.25 4.125v15.75a3.375 3.375 0 0 0 3.375 3.375h6.75a3.375 3.375 0 0 0 3.375-3.375V4.125A3.375 3.375 0 0 0 15.375.75h-6.75ZM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 0 1 7.5 19.875V4.125Z" clipRule="evenodd" />
                </svg>

                {isProcessing ? 'กำลังดำเนินการ...' : 'ชำระด้วยบัญชีธนาคาร'}
            </button>
        </div>
    );
};