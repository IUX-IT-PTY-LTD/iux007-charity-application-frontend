import LeftSidebar from '@/components/dashboard-components/sidebar'
import React from 'react'
import { FaDownload } from 'react-icons/fa'

const DonationHistory = () => {
    return (
        <div className='donation-history'>
            <form className="space-y-4">
                <div className="mb-8">
                    <h3 className="text-gray-800 text-3xl font-extrabold">
                        Donation History
                    </h3>
                </div>

                <div className="flex justify-between items-end gap-3">
                    <div className='w-full'>
                        <label className="text-gray-800 text-sm mb-2 block">
                            Search
                        </label>
                        <div className="relative flex items-center">
                            <input
                                name="search"
                                type="text"
                                required
                                className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                                placeholder="Search for donation"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#bbb"
                                stroke="#bbb"
                                className="w-[18px] h-[18px] absolute right-4"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    cx="10"
                                    cy="7"
                                    r="6"
                                    data-original="#000000"
                                ></circle>
                                <path
                                    d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-
                                            2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                    data-original="#000000"
                                ></path>
                            </svg>
                        </div>
                    </div>

                    <div className='w-full'>
                        <label className="text-gray-800 text-sm mb-2 block">
                            Filter
                        </label>
                        <div className="relative flex items-center">
                            <select
                                name="filter"
                                required
                                className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                            >
                                <option value="all">All</option>
                                <option value="donated">Donated</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full px-10 bg-primary text-white py-3 rounded-lg font-semibold text-sm"
                        >
                            Search
                        </button>
                    </div>
                </div>

                <hr className='my-5' />

                {/* donation list table */}
                <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr>
                                <th className="text-left px-4 py-2">Event</th>
                                <th className="text-left px-4 py-2">Donation Amount</th>
                                <th className="text-left px-4 py-2">Donation Date</th>
                                <th className="text-left px-4 py-2">Status</th>
                                <th className='text-right px-4 py-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* event td should have image, and title */}
                            <tr>
                                <td className="border px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <img src="/assets/img/event-img.jpg" alt="logo" className="w-10 h-10" />
                                        <div className="details">
                                            <p>Event Title</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="border px-4 py-2">
                                    $100
                                </td>
                                <td className="border px-4 py-2">
                                    12-12-2021
                                </td>
                                <td className="border px-4 py-2">
                                    <span className="bg-secondary text-white px-3 py-1 text-sm rounded-md">Donated</span>
                                </td>
                                <td className="border px-4 py-2 text-right">
                                    <button className="bg-primary text-white text-sm px-3 py-1 rounded-md">
                                        <FaDownload />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <img src="/assets/img/event-img.jpg" alt="logo" className="w-10 h-10" />
                                        <div className="details">
                                            <p>Event Title</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="border px-4 py-2">
                                    $100
                                </td>
                                <td className="border px-4 py-2">
                                    12-12-2021
                                </td>
                                <td className="border px-4 py-2">
                                    <span className="bg-secondary text-white px-3 py-1 text-sm rounded-md">Donated</span>
                                </td>
                                <td className="border px-4 py-2 text-right">
                                    <button className="bg-primary text-white text-sm px-3 py-1 rounded-md">
                                        <FaDownload />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <img src="/assets/img/event-img.jpg" alt="logo" className="w-10 h-10" />
                                        <div className="details">
                                            <p>Event Title</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="border px-4 py-2">
                                    $100
                                </td>
                                <td className="border px-4 py-2">
                                    12-12-2021
                                </td>
                                <td className="border px-4 py-2">
                                    <span className="bg-secondary text-white px-3 py-1 text-sm rounded-md">Donated</span>
                                </td>
                                <td className="border px-4 py-2 text-right">
                                    <button className="bg-primary text-white text-sm px-3 py-1 rounded-md">
                                        <FaDownload />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <img src="/assets/img/event-img.jpg" alt="logo" className="w-10 h-10" />
                                        <div className="details">
                                            <p>Event Title</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="border px-4 py-2">
                                    $100
                                </td>
                                <td className="border px-4 py-2">
                                    12-12-2021
                                </td>
                                <td className="border px-4 py-2">
                                    <span className="bg-secondary text-white px-3 py-1 text-sm rounded-md">Donated</span>
                                </td>
                                <td className="border px-4 py-2 text-right">
                                    <button className="bg-primary text-white text-sm px-3 py-1 rounded-md">
                                        <FaDownload />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <img src="/assets/img/event-img.jpg" alt="logo" className="w-10 h-10" />
                                        <div className="details">
                                            <p>Event Title</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="border px-4 py-2">
                                    $100
                                </td>
                                <td className="border px-4 py-2">
                                    12-12-2021
                                </td>
                                <td className="border px-4 py-2">
                                    <span className="bg-secondary text-white px-3 py-1 text-sm rounded-md">Donated</span>
                                </td>
                                <td className="border px-4 py-2 text-right">
                                    <button className="bg-primary text-white text-sm px-3 py-1 rounded-md">
                                        <FaDownload />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <img src="/assets/img/event-img.jpg" alt="logo" className="w-10 h-10" />
                                        <div className="details">
                                            <p>Event Title</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="border px-4 py-2">
                                    $100
                                </td>
                                <td className="border px-4 py-2">
                                    12-12-2021
                                </td>
                                <td className="border px-4 py-2">
                                    <span className="bg-secondary text-white px-3 py-1 text-sm rounded-md">Donated</span>
                                </td>
                                <td className="border px-4 py-2 text-right">
                                    <button className="bg-primary text-white text-sm px-3 py-1 rounded-md">
                                        <FaDownload />
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <img src="/assets/img/event-img.jpg" alt="logo" className="w-10 h-10" />
                                        <div className="details">
                                            <p>Event Title</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="border px-4 py-2">
                                    $100
                                </td>
                                <td className="border px-4 py-2">
                                    12-12-2021
                                </td>
                                <td className="border px-4 py-2">
                                    <span className="bg-secondary text-white px-3 py-1 text-sm rounded-md">Donated</span>
                                </td>
                                <td className="border px-4 py-2 text-right">
                                    <button className="bg-primary text-white text-sm px-3 py-1 rounded-md">
                                        <FaDownload />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </form>
        </div>
    )
}

export default DonationHistory