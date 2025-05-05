import Link from "next/link";
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthLayout from "../components/layouts/AuthLayout";
import Swal from 'sweetalert2'

export default function Register() {
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            setError("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
            return;
        }
    
        const userData = {
            first_name: firstname,
            last_name: lastname,
            email,
            password,
            phone_number: phone,
        };
    
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData), 
        });
    
        const data = await response.json();
    
        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'ลงทะเบียนสำเร็จ',
                text: 'คุณสามารถเข้าสู่ระบบได้แล้ว!',
                showConfirmButton: false,
                timer: 2000,
            });
            router.push("/loginView");
        } else {
            setError(data.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
        }
    };
    
    return (
        <AuthLayout>
            <Head>
                <title>สมัครสมาชิก | My Hotel</title>
            </Head>
            <div className="mt-32">
                <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                    <div className="hidden lg:block lg:w-1/2 bg-cover" style={{ backgroundImage: 'url("https://cdn.pixabay.com/photo/2024/04/20/00/20/luxury-8707492_640.png")' }}></div>
                    <div className="w-full p-8 lg:w-1/2">
                        <Link href="/" className="flex items-center justify-center space-x-3 rtl:space-x-reverse font-semibold text-yellow-700">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                                <path d="M19.006 3.705a.75.75 0 1 0-.512-1.41L6 6.838V3a.75.75 0 0 0-.75-.75h-1.5A.75.75 0 0 0 3 3v4.93l-1.006.365a.75.75 0 0 0 .512 1.41l16.5-6Z" />
                                <path fillRule="evenodd" d="M3.019 11.114 18 5.667v3.421l4.006 1.457a.75.75 0 1 1-.512 1.41l-.494-.18v8.475h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3v-9.129l.019-.007ZM18 20.25v-9.566l1.5.546v9.02H18Zm-9-6a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75H9Z" clipRule="evenodd" />
                            </svg>
                            <span className="self-center font-bold text-2xl whitespace-nowrap">My Hotel</span>
                        </Link>

                        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                        <form onSubmit={handleRegister}>
                            <div className="mt-4">
                                <div className="flex justify-center items-center">
                                    <div className="mx-1">
                                        <div className="flex justify-between">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">ชื่อ</label>
                                        </div>
                                        <input
                                            className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                            type="text"
                                            value={firstname}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mx-1">
                                        <div className="flex justify-between">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">นามสกุล</label>
                                        </div>
                                        <input
                                            className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                            type="text"
                                            value={lastname}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-center items-center">
                                    <div className="mx-1">
                                        <div className="flex justify-between">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">อีเมล์</label>
                                        </div>
                                        <input
                                            className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mx-1">
                                        <div className="flex justify-between">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">เบอร์</label>
                                        </div>
                                        <input
                                            className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                    <div className="mx-1">
                                        <div className="flex justify-between">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">รหัสผ่าน</label>
                                        </div>
                                        <input
                                            className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mx-1">
                                        <div className="flex justify-between">
                                            <label className="block text-gray-700 text-sm font-bold mb-2">ยืนยันรหัสผ่าน</label>
                                        </div>
                                        <input
                                            className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                </div>
                            </div>
                            <div className="mt-8">
                                <button className="bg-yellow-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600">ลงทะเบียน</button>
                            </div>
                        </form>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="border-b w-1/5 md:w-1/4" />
                            <Link href="/loginView" className="text-xs text-gray-500 uppercase">มีบัญชีอยู่แล้ว?</Link>
                            <span className="border-b w-1/5 md:w-1/4" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}