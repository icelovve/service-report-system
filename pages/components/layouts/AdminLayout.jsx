import React from 'react'
import SidebarAdmin from '../share/SidebarAdmin'
import NavbarAdmin from '../share/NavbarAdmin'

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <SidebarAdmin />
            <NavbarAdmin />
            <main className="pl-64 pt-16">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;