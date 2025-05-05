import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import Head from 'next/head';

const Index = () => {
    return (
        <MainLayout>
            <Head>
                <title>ชำระเงินสำเร็จ | My Hotel</title>
                <meta name='description' content='Payment Success Page' />
            </Head>
            <h1 className='text-center font-bold text-xl mt-12'>
                ขอบคุณที่ใช้บริการ
            </h1>
        </MainLayout>
    );
};

export default Index;
