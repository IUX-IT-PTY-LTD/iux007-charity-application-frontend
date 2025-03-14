import React from 'react'

const AdminPageHeader = ({ title }) => {
    return (
        <div className="header bg-gray-100 py-4">
            <div className="container mx-auto px-5">
                <h1 className="text-2xl font-bold">{title}</h1>
            </div>
        </div>
    )
}

export default AdminPageHeader