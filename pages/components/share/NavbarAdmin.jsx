import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const NavbarAdmin = () => {
    const [user, setUser] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    useEffect(() => {
        const userData = localStorage.getItem('users');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
        } else {
            console.log('No user data found in localStorage.');
        }
    }, []);

    useEffect(() => {
        if (user) {
            if (user.role !== 'admin') {
                router.push('/');
            } else {
            }
        }
    }, [user, router]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('users');
        Swal.fire({
            icon: "success",
            text: "กำลังออกจากระบบ!",
            showConfirmButton: false,
            timer: 1500,
        }).then(() => {
            window.location.href = '/loginView';
        });
    };

    if (!user) {
        return null; 
    }

    return (
        <nav className="bg-white border-b h-16 fixed top-0 right-0 left-64 z-10">
            <div className="h-full px-6 flex items-center justify-end">
                <div className="relative">
                    <button
                        type="button"
                        className="flex items-center space-x-3 focus:outline-none"
                        onClick={toggleDropdown}
                        aria-expanded={isOpen}
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                                {user?.name?.[0] || 'A'}
                            </span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                            {user?.name || 'Admin'}
                        </span>
                    </button>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg ring-1 ring-black ring-opacity-5">
                            <ul className="py-2">
                                <li>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Profile
                                    </a>
                                </li>
                                <li>
                                    <p
                                        onClick={handleLogout}
                                        className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 cursor-pointer"
                                    >
                                        Sign Out
                                    </p>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavbarAdmin;
