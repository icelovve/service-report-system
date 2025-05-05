import MainLayout from "./components/layouts/MainLayout";
import Head from "next/head";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const imageList = [
    { img: '/hotel-1.jpeg', alt: 'luxury hotel room 1' },
    { img: '/hotel-2.webp', alt: 'hotel exterior view' },
    { img: '/hotel-3.jpeg', alt: 'modern hotel interior' },
    { img: '/hotel-4.jpeg', alt: 'hotel lobby' },
    { img: '/hotel-5.jpg', alt: 'hotel lobby' },
];

export default function Home() {
    return (
        <MainLayout>
            <Head>
                <html lang="th" />
                <title>หน้าแรก | My Hotel</title>
                <meta
                    name="description"
                    content="จองโรงแรมออนไลน์ง่าย ๆ กับ My Hotel พบกับโรงแรมหรู ห้องพักสะดวกสบาย ในราคาพิเศษ พร้อมสิทธิพิเศษและบริการที่ดีที่สุดสำหรับคุณ."
                />
                <meta 
                    name="keywords"
                    content="ห้องพัก, โรงแรม, จองโรงแรมออนไลน์, โรงแรมหรู, ห้องพักสะดวกสบาย, ห้องพักราคาถูก, My Hotel"
                />
            </Head>
            <main>
                {/* <div className="flex flex-col items-center justify-center w-full">
                    <Swiper
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        className="w-full h-96"
                    >
                        {imageList.map((item, index) => (
                            <SwiperSlide key={index} className="relative w-full h-auto">
                                <Image
                                    src={item.img}
                                    alt={item.alt}
                                    layout="fill"
                                    objectFit="cover"
                                    objectPosition="center"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div> */}
            </main>
        </MainLayout>
    );
}
