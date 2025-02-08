import AdminSidebar from '@/components/admin/sidebar'
import React from 'react'

const AdminDashboard = () => {
    return (
        <div>
            <div className="flex jusrify-start items-start gap-3">
                <div className="w-1/4">
                    <AdminSidebar />
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard