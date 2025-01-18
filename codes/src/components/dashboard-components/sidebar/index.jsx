import React from 'react'

const LeftSidebar = () => {
    return (
        <div>
            {/* dashboard, update password, donation history, update profile, logout */}
            <div className="bg-white rounded-lg p-5 shadow-lg">

                {/* profile details */}
                <div className="flex items-center space-x-4">
                    <img
                        src="/assets/img/avatar.jpg"
                        alt=""
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <h4 className="text-lg font-semibold text-secondary">
                            John Doe
                        </h4>
                        <p className="text-base text-body-color dark:text-dark-6">
                            CEO
                        </p>
                    </div>
                </div>

                <hr className='my-4' />
                <ul className="space-y-4">
                    <li>
                        <a href="#" className="text-gray-600 hover:text-primary">
                            Dashboard
                        </a>
                    </li>
                    <hr />
                    <li>
                        <a href="#" className="text-gray-600 hover:text-primary">
                            Update Password
                        </a>
                    </li>
                    <hr />
                    <li>
                        <a href="#" className="text-gray-600 hover:text-primary">
                            Donation History
                        </a>
                    </li>
                    <hr />
                    <li>
                        <a href="#" className="text-gray-600 hover:text-primary">
                            Update Profile
                        </a>
                    </li>
                    <hr />
                    <li>
                        <a href="#" className="text-gray-600 hover:text-primary">
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default LeftSidebar