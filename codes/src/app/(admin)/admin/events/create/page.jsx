'use client'

import React, { useState } from 'react'
import AdminPageHeader from '@/components/admin-page-header'
import { useRouter } from 'next/navigation'

const AdminEventCreate = () => {
    const router = useRouter()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        price: '',
        target_amount: '',
        is_fixed_donation: false,
        location: '',
        status: '1',
        is_featured: false,
        featured_image: '',
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Creating event:', formData)
        // Add API call to submit formData
        // router.push('/admin/events')
    }

    return (
        <div className='h-screen overflow-y-auto'>
            <AdminPageHeader title="Create Event" />

            <div className="p-4 w-2/3 mx-auto my-10 bg-white rounded shadow">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Event Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            rows="4"
                            required
                        />
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    {/* Target Amount */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Target Amount</label>
                        <input
                            type="number"
                            name="target_amount"
                            value={formData.target_amount}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    {/* Is Fixed Donation */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_fixed_donation"
                            checked={formData.is_fixed_donation}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="font-medium text-gray-700">Is Fixed Donation</label>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>

                    {/* Is Featured */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_featured"
                            checked={formData.is_featured}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="font-medium text-gray-700">Is Featured</label>
                    </div>

                    {/* Featured Image */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Featured Image</label>
                        <input
                            type="file"
                            name="featured_image"
                            onChange={(e) => setFormData({ ...formData, featured_image: e.target.files[0] })}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            accept="image/*"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminEventCreate
