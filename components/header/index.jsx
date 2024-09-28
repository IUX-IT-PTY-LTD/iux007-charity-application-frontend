import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Header = () => {
    return (
        <div className='bg-[#009BD3]'>
            <div className="max-w-7xl mx-auto">
                <div className="flex p-5 justify-between items-center">
                    <Link href="/">
                        <Image src="/img/logo-transparent.png" alt="logo" width={50} height={50} />
                        <span></span>
                    </Link>

                    <div className="flex justify-center items-center gap-10">
                        <Link className='text-white hover:text-yellow-500' href={"/food-water"}>Food & Water</Link>
                        <Link className='text-white hover:text-yellow-500' href={"/food-water"}>Palestine</Link>
                        <Link className='text-white hover:text-yellow-500' href={"/food-water"}>Ali Banat</Link>
                        <Link className='text-white hover:text-yellow-500' href={"/food-water"}>Instagram</Link>
                        <Link className='text-white hover:text-yellow-500' href={"/food-water"}>Contact</Link>
                    </div>

                    <Link className='btn btn-glow' href={"/"}>Donate</Link>
                </div>

                {/* second nav */}
                
                {/* second nav */}
            </div>
        </div>
    )
}

export default Header