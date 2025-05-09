'use client'

import React, { useState } from 'react'
import AdminPageHeader from '@/components/admin/header'
import { useRouter } from 'next/navigation'

const AdminCreateFAQ = () => {
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [ordering, setOrdering] = useState(1)
    const [status, setStatus] = useState(1)
    const router = useRouter()

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()

        const newFAQ = {
            question,
            answer,
            ordering,
            status,
        }

        // API call to save the FAQ
        // Example of how to send the request:
        // const response = await fetch('/api/faqs', {
        //   method: 'POST',
        //   body: JSON.stringify(newFAQ),
        //   headers: { 'Content-Type': 'application/json' },
        // })
        // const data = await response.json()

        console.log('New FAQ submitted:', newFAQ)

        // Redirect to the FAQ list page after successful creation
        router.push('/admin/faqs')
    }

    return (
        <div>
            <AdminPageHeader title="Create New FAQ" />
            <div className="p-4">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                    <div className="mb-4">
                        <label htmlFor="question" className="block text-sm font-medium text-gray-700">
                            Question
                        </label>
                        <input
                            type="text"
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="answer" className="block text-sm font-medium text-gray-700">
                            Answer
                        </label>
                        <textarea
                            id="answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            required
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                            rows="4"
                        />
                    </div>
                    <div className="mb-4 flex items-center">
                        <label htmlFor="ordering" className="mr-4 text-sm font-medium text-gray-700">
                            Ordering
                        </label>
                        <input
                            type="number"
                            id="ordering"
                            value={ordering}
                            onChange={(e) => setOrdering(Number(e.target.value))}
                            required
                            min="1"
                            className="p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <div className="flex items-center space-x-4">
                            <label>
                                <input
                                    type="radio"
                                    name="status"
                                    value="1"
                                    checked={status === 1}
                                    onChange={() => setStatus(1)}
                                />
                                Active
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="status"
                                    value="0"
                                    checked={status === 0}
                                    onChange={() => setStatus(0)}
                                />
                                Inactive
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-6 rounded"
                        >
                            Create FAQ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminCreateFAQ
