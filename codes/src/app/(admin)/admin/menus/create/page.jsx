import AdminPageHeader from '@/components/admin-page-header'
import Link from 'next/link'
import React from 'react'

const AdminMenus = () => {
    return (
        <div>

            <AdminPageHeader title="Create Menu" />
            <div className="p-4">
                <Link href="/admin/menus/create">
                    <span className="bg-blue-500 text-white py-2 px-4 rounded">Create Menu</span>
                </Link>
            </div>
        </div>
    )
}

export default AdminMenus