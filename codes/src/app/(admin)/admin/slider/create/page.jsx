'use client'

import React, { useState } from 'react'
import AdminPageHeader from '@/components/admin/header'
import { useRouter } from 'next/navigation'

const AdminSliderCreate = () => {
    const router = useRouter()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ordering: '',
        status: '1',
        image: '',
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked })
        } else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
            setFormData({ ...formData, image: reader.result })
        }
        if (file) {
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Creating slider:', formData)
        // Add API call to submit formData
        // router.push('/admin/sliders')
    }

    return (
        <div>
            <AdminPageHeader title="Create Slider" />

            <div className="p-4 w-2/3 mx-auto my-10 bg-white rounded shadow">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Slider Title</label>
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

                    {/* Ordering */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Ordering</label>
                        <input
                            type="number"
                            name="ordering"
                            value={formData.ordering}
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

                    {/* Image */}
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Slider Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            accept="image/*"
                        />
                        {formData.image && (
                            <div className="mt-4">
                                <img src={formData.image} alt="Preview" className="w-48 h-48 object-cover rounded" />
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Create Slider
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminSliderCreate
