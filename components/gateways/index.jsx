import Image from 'next/image'
import React from 'react'

const Gatweays = () => {
    const data = [
        {
            id: 1,
            img: "/img/g1.png"
        },
        {
            id: 2,
            img: "/img/g2.png"
        },
        {
            id: 3,
            img: "/img/g3.png"
        },
        {
            id: 4,
            img: "/img/g4.png"
        },
        {
            id: 5,
            img: "/img/g5.png"
        },
    ]
    return (
        <div className='gateways py-6 bg-white'>
            <div className="container max-w-7xl mx-auto">
                <div className="flex justify-center items-center gap-10">
                    {
                        data.map((item, index) => (
                            <div key={index} className="gateway">
                                <Image width={100} height={100} className='h-[120px] w-auto' unoptimized src={item.img} alt="gateway" />
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Gatweays