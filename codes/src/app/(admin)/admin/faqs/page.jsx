'use client'

import React, { useState, useEffect } from 'react'
import AdminPageHeader from '@/components/admin/header'
import Link from 'next/link'

const AdminFAQsList = () => {
    const [faqs, setFaqs] = useState([])

    // Fetch FAQs from the API or mock data
    useEffect(() => {
        // Replace this mock data with your API call
        const fetchFaqs = async () => {
            // Mock data for now
            const mockFaqs = [
                {
                    id: 1,
                    question: 'What is your name?',
                    answer: 'My name is John Doe.',
                    ordering: 1,
                    status: 1,
                },
                {
                    id: 2,
                    question: 'What do you do?',
                    answer: 'I am a web developer.',
                    ordering: 2,
                    status: 1,
                },
            ]
            setFaqs(mockFaqs)
        }

        fetchFaqs()
    }, [])

    const handleDelete = (id) => {
        // Add API call for deleting the FAQ
        // After successful deletion, remove it from the list
        setFaqs(faqs.filter((faq) => faq.id !== id))
        console.log('FAQ deleted:', id)
    }

    return (
        <div>
            <AdminPageHeader title="FAQs" />
            <div className="p-4">
                <Link href="/admin/faqs/create">
                    <span className="bg-blue-500 text-white py-2 px-4 rounded">Create New FAQ</span>
                </Link>
            </div>

            <div className="overflow-x-auto p-4">
                <table className="min-w-full table-auto bg-white rounded shadow">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Question</th>
                            <th className="px-4 py-2 border">Answer</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faqs.map((faq) => (
                            <tr key={faq.id}>
                                <td className="px-4 py-2 border">{faq.question}</td>
                                <td className="px-4 py-2 border">{faq.answer}</td>
                                <td className="px-4 py-2 border">
                                    {faq.status === 1 ? 'Active' : 'Inactive'}
                                </td>
                                <td className="px-4 py-2 border">
                                    <Link href={`/admin/faqs/edit/${faq.id}`} className="text-blue-500">
                                        Edit
                                    </Link>{' '}
                                    |{' '}
                                    <button
                                        onClick={() => handleDelete(faq.id)}
                                        className="text-red-500"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminFAQsList
