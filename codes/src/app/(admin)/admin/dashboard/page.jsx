'use client'

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const AdminDashboard = () => {
    const router = useRouter();
    useEffect(() => {
        const token = Cookies.get('admin_token');
        console.log(token);

        if (!token) {
            router.push('/admin');
        }
    }, [router]);

    // check if access_token is in cookie
    // if not redirect to login page



    return (
        <div>
            Admin Dashboard
        </div>
    )
}

export default AdminDashboard