import Link from "next/link";
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthLayout from "../components/layouts/AuthLayout";
import Swal from 'sweetalert2'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            Swal.fire({
                icon: "success",
                text: `ยินดีต้อนรับกลับ!`,
                showConfirmButton: false,
                timer: 1500
            });
            localStorage.setItem("isLoggedIn", true);
            localStorage.setItem("users", JSON.stringify(data.users));

            if(data.users.role === 'admin') {
                router.push('/adminView');
            }else{
                router.push('/');
            }

        } else {
            Swal.fire({
                icon: "error",
                text: `คุณกรอกข้อมูลไม่ถูกต้อง!`,
                showConfirmButton: false,
                timer: 1500
            });
            setError(data.message || 'Something went wrong!');
        }
    };

    return (
        <AuthLayout>
            <Head>
                <title>เข้าสู่ระบบ | My Hotel</title>
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

                        <a href="#" class="flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100">
                            <div class="px-4 py-3">
                                <svg class="h-6 w-6" viewBox="0 0 40 40">
                                    <path
                                        d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                                        fill="#FFC107" />
                                    <path
                                        d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                                        fill="#FF3D00" />
                                    <path
                                        d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                                        fill="#4CAF50" />
                                    <path
                                        d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                                        fill="#1976D2" />
                                </svg>
                            </div>
                            <h1 class="px-4 py-3 w-5/6 text-center text-gray-600 font-bold">Sign in with Google</h1>
                        </a>
                        <div class="mt-4 flex items-center justify-between">
                            <span class="border-b w-1/5 lg:w-1/4"></span>
                            <a href="#" class="text-xs text-center text-gray-500 uppercase">หรือเข้าสู่ระบบด้วยอีเมล์</a>
                            <span class="border-b w-1/5 lg:w-1/4"></span>
                        </div>

                        <form onSubmit={handleLogin}>
                            <div className="mt-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">อีเมล์</label>
                                <input
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">รหัสผ่าน</label>
                                    <a href="#" className="text-xs text-gray-500">ลืมรหัสผ่าน?</a>
                                </div>
                                <input
                                    className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mt-8">
                                <button className="bg-yellow-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600">เข้าสู่ระบบ</button>
                            </div>
                        </form>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="border-b w-1/5 md:w-1/4" />
                            <Link href="/loginView/Register" className="text-xs text-gray-500 uppercase">สมัครสมาชิก</Link>
                            <span className="border-b w-1/5 md:w-1/4" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    )
}