import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const RoundedHeader = () => {
    const menuData = [
        {
            id: 1,
            title: 'Palestine',
            link: '/',
            img: '/img/r1.png'
        },
        {
            id: 2,
            title: 'Orphans',
            link: '/',
            img: '/img/r2.png'
        },
        {
            id: 3,
            title: 'Sadaqah Jariyah',
            link: '/',
            img: '/img/r3.png'
        },
        {
            id: 4,
            title: 'Ali Banat',
            link: '/',
            img: '/img/r4.png'
        },
        {
            id: 5,
            title: 'Zakat',
            link: '/',
            img: '/img/r5.png'
        },
        {
            id: 6,
            title: 'Regular Giving',
            link: '/',
            img: '/img/r6.png'
        },
        {
            id: 7,
            title: 'Water Aid',
            link: '/',
            img: '/img/r7.png'
        },
        {
            id: 8,
            title: 'Legacy',
            link: '/',
            img: '/img/r8.png'
        },
        {
            id: 9,
            title: 'Contact',
            link: '/',
            img: '/img/r9.png'
        },
    ]
    return (
        <div className='rounded-header bg-[#0A3484] py-3'>
            <div className="container max-w-7xl mx-auto flex justify-center items-center gap-8">
                {
                    menuData.map((menu) => (
                        <Link key={menu.id} href={menu.link} className='text-white text-center hover:text-yellow-500'>
                            <Image src={menu.img} className='mb-1 hover-ripple' alt="logo" width={80} height={80} />
                            <span className="text-[13px] w-100">{menu.title}</span>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default RoundedHeader