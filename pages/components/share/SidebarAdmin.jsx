import Link from 'next/link';
import React from 'react';

const SidebarAdmin = () => {
    const menuItems = [
        { label: "Dashboard", icon: "⚡", link: "/adminView" },
        { label: "Users", icon: "👥", link: "/adminView/user" },
        { label: "Rooms", icon: "🏠", link: "/adminView/rooms" },
        { label: "Bookings", icon: "📅", link: "/adminView/bookings" },
    ];

    return (
        <aside className="bg-white shadow-lg h-screen fixed top-0 left-0 w-64 transition-transform">
            <div className="h-16 flex items-center px-6 border-b">
                <Link href="/adminView" className="flex items-center space-x-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-8 h-8 text-yellow-600"
                    >
                        <path d="M19.006 3.705a.75.75 0 1 0-.512-1.41L6 6.838V3a.75.75 0 0 0-.75-.75h-1.5A.75.75 0 0 0 3 3v4.93l-1.006.365a.75.75 0 0 0 .512 1.41l16.5-6Z" />
                        <path
                            fillRule="evenodd"
                            d="M3.019 11.114 18 5.667v3.421l4.006 1.457a.75.75 0 1 1-.512 1.41l-.494-.18v8.475h.75a.75.75 0 0 1 0 1.5H2.25a.75.75 0 0 1 0-1.5H3v-9.129l.019-.007ZM18 20.25v-9.566l1.5.546v9.02H18Zm-9-6a.75.75 0 0 0-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75H9Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="font-semibold text-xl text-gray-800">My Hotel</span>
                </Link>
            </div>
            <nav className="p-4">
                <ul className="space-y-1">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                href={item.link}
                                className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-yellow-600 transition-colors"
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default SidebarAdmin;