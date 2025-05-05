import Link from "next/link";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const closeDropdown = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        setIsAuthenticated(isLoggedIn === "true");
    }, []);

    useEffect(() => {
        const userData = localStorage.getItem("users");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
        } else {
            console.log("No user data found in localStorage.");
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem('users');
        Swal.fire({
            icon: "success",
            text: "กำลังออกจากระบบ!",
            showConfirmButton: false,
            timer: 1500,
        }).then(() => {
            window.location.reload();
        });
    };

    return (
        <nav className="bg-white border-gray-100 py-4">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse font-semibold text-yellow-700">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                        <path d="M19.006 3.705a.75.75 0 1 0-.512-1.41L6 6.838V3a.75.75 0 0 0-.75-.75h-1.5A.75.75 0 0 0 3 3v4.93l-1.006.365a.75.75 0 0 0 .512 1.41l16.5-6Z" />
                        <path fillRule="evenodd" d="M3.019 11.114 18 5.667v3.421l4.006 1.457a.75.75 0 1 1-.512 1.41l-.494-.18v8.475h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3v-9.129l.019-.007ZM18 20.25v-9.566l1.5.546v9.02H18Zm-9-6a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75H9Z" clipRule="evenodd" />
                    </svg>
                    <span className="self-center font-bold text-2xl whitespace-nowrap text-black">My Hotel</span>
                </Link>
                <button
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    onClick={toggleDropdown}
                >
                    <span className="sr-only">Open menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className={`hidden md:block w-full md:w-auto ${isOpen ? 'block' : 'hidden'}`}>
                    <ul className="flex flex-col items-center font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
                        <li>
                            <Link href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-700 md:p-0">หน้าแรก</Link>
                        </li>
                        <li>
                            <Link href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-700 md:p-0">ห้องพัก</Link>
                        </li>
                        <li>
                            <Link href="/bookingView" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-700 md:p-0">จองห้องพัก</Link>
                        </li>
                        <li>
                            <Link href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-yellow-700 md:p-0">ติดต่อเรา</Link>
                        </li>
                        <li>
                            {isAuthenticated ? (
                                <div className="relative">
                                    <div 
                                        onClick={toggleDropdown} 
                                        className="flex py-2 px-4 bg-yellow-700 justify-center items-center text-white rounded-full cursor-pointer"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        <p className="ml-2 w-12 truncate">{user ? user.name : 'User'}</p>
                                    </div>

                                    {isOpen && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg ring-1 ring-black ring-opacity-5">
                                            <ul className="py-2">
                                                <li>
                                                    <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">โปรไฟล์</Link>
                                                </li>
                                                <li>
                                                    <Link href="/myBooking" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">การจองของฉัน</Link>
                                                </li>
                                                <li>
                                                    <p onClick={handleLogout} className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100">ออกจากระบบ</p>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href="/loginView" className="block py-2 px-4 bg-yellow-700 p-4 text-white rounded-lg">เข้าสู่ระบบ</Link>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
