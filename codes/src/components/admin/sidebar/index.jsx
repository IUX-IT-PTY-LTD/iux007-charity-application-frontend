'use client'
import Link from 'next/link'
import React from 'react'
import { FaHistory } from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'
import { GrUpdate } from 'react-icons/gr'
import { TbPasswordUser } from 'react-icons/tb'
import { LiaSignOutAltSolid } from 'react-icons/lia'

const AdminSidebar = () => {
    // hightlight active link
    const [currentLink, setCurrentLink] = React.useState('')
    React.useEffect(() => {
        setCurrentLink(window.location.pathname)
    }, [])
    return (
        <div>
            {/* dashboard, update password, donation history, update profile, logout */}
            <div className="bg-white rounded-lg p-5 shadow-lg h-screen">

                {/* profile details */}
                <div className="flex items-center space-x-4">
                    <img
                        src="/assets/img/avatar.jpg"
                        alt=""
                        className="w-12 h-12 rounded-full"
                    />
                    <div>
                        <h4 className="text-lg font-semibold text-secondary">
                            Admin Admin
                        </h4>
                        <p className="text-base text-body-color dark:text-dark-6">
                            Admin
                        </p>
                    </div>
                </div>

                <hr className='my-4' />
                <ul className="space-y-4 flex flex-col justify-between items-start h-[calc(100%-5.5rem)]">
                    <div className="top space-y-4 flex flex-col justify-between items-start w-full">
                        <li className='w-full'>
                            <Link href="/admin/dashboard" onClick={() => {
                                setCurrentLink('/admin/dashboard')
                            }} className={`text-gray-600 w-full flex justify-start items-center gap-2 hover:text-primary ${currentLink === '/admin/dashboard' ? 'text-primary font-bold' : ''}`}>
                                <MdDashboard className='inline text-2xl' /> Dashboard
                            </Link>
                        </li>
                        <hr />

                        <li className='w-full'>
                            <Link href="/admin/menus" onClick={() => {
                                setCurrentLink('/admin/menus')
                            }} className={`text-gray-600 w-full flex justify-start items-center gap-2 hover:text-primary ${currentLink === '/admin/menus' ? 'text-primary font-bold' : ''}`}>
                                <FaHistory className='inline text-2xl' /> Menus
                            </Link>
                        </li>
                        <hr />
                        <li className='w-full'>
                            <Link href="/admin/events" onClick={() => {
                                setCurrentLink('/admin/events')
                            }} className={`text-gray-600 w-full flex justify-start items-center gap-2 hover:text-primary ${currentLink === '/admin/events' ? 'text-primary font-bold' : ''}`}>
                                <GrUpdate className='inline text-2xl' /> Events
                            </Link>
                        </li>
                        <hr />
                        <li className='w-full'>
                            <Link href="/admin/contents" onClick={() => {
                                setCurrentLink('/admin/contents')
                            }} className={`text-gray-600 w-full flex justify-start items-center gap-2 hover:text-primary ${currentLink === '/admin/contents' ? 'text-primary font-bold' : ''}`}>
                                <TbPasswordUser className='inline text-2xl' /> Contents
                            </Link>
                        </li>
                    </div>
                    <li>
                        <Link href="/admin" className="text-gray-600 hover:text-primary">
                            <LiaSignOutAltSolid className='inline text-2xl' /> Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default AdminSidebar