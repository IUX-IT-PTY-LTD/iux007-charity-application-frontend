import LeftSidebar from '@/components/dashboard-components/sidebar'
import React from 'react'

const ChangePassword = () => {
    return (
        <div className='change-password'>
            <form className="space-y-4">
                <div className="mb-8">
                    <h3 className="text-gray-800 text-3xl font-extrabold">
                        Change Password
                    </h3>
                    <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                        Change your password to keep your account secure.
                    </p>
                </div>

                <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                        Current Password
                    </label>
                    <div className="relative flex items-center">
                        <input
                            name="current-password"
                            type="password"
                            required
                            className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                            placeholder="Enter current password"
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

                {/* new and confirm password */}

                <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                        New Password
                    </label>
                    <div className="relative flex items-center">
                        <input
                            name="new-password"
                            type="password"
                            required
                            className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                            placeholder="Enter new password"
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

                <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                        Confirm Password
                    </label>
                    <div className="relative flex items-center">
                        <input
                            name="confirm-password"
                            type="password"
                            required
                            className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-600"
                            placeholder="Confirm new password"
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

                <div>
                    <button
                        type="submit"
                        className="bg-primary text-white px-5 py-2 rounded-md"
                    >
                        Change Password
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChangePassword