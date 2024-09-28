import Image from 'next/image'
import React from 'react'

const SingleFilter = () => {
    const [activeFilter, setActiveFilter] = React.useState(1)
    const filters = [
        {
            id: 1,
            name: 'Urgent Apeals',
            items: [
                {
                    id: 1,
                    img: "/img/f1.jpg",
                    title: "Gaza Can’t Wait!",
                    description: "For almost a year, too many people have suffered for far too long due to the devastation the conflict in Palestine has left in its wake. The lives of children and their",
                    supporters: 17,
                    dayLeft: 7,
                    goal: 500000,
                    collected: 98910
                },

            ]
        },
        {
            id: 2,
            name: 'Palestine Emergency',
            items: [
                {
                    id: 3,
                    img: "/img/f3.jpg",
                    title: "Help Rebuild Lives for Palestinians escaping conflict",
                    description: "For almost a year, too many people have suffered for far too long due to the devastation the conflict in Palestine has left in its wake. The lives of children and their",
                    supporters: 17,
                    dayLeft: 7,
                    goal: 500000,
                    collected: 98910
                },

            ]
        },
        {
            id: 3,
            name: 'Top Apeals',
            items: [
                {
                    id: 2,
                    img: "/img/f2.jpg",
                    title: "GAZA: Limbs of Hope",
                    description: "For almost a year, too many people have suffered for far too long due to the devastation the conflict in Palestine has left in its wake. The lives of children and their",
                    supporters: 17,
                    dayLeft: 7,
                    goal: 500000,
                    collected: 98910
                },

            ]
        },
    ]
    // const [active,]
    return (
        <div className='filterableCards py-10 bg-[#263B7E]'>
            <div className="container max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className='mb-6 text-3xl'>Sadaqah Jariyah</h2>
                </div>
                <div className="flex justify-center items-center gap-4">
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            className={`rounded-full text-black px-10 py-2 ${activeFilter === filter.id ? 'bg-[#F60462] text-white' : 'bg-gray-200 text-black'}`}
                            onClick={() => setActiveFilter(filter.id)}
                        >
                            {filter.name}
                        </button>
                    ))}
                </div>

                {/* show 4 cards in a row based on the activeFilter */}
                <div className="mt-10 grid grid-cols-1 gap-4">
                    {filters.find((filter) => filter.id === activeFilter).items.map((item) => (
                        <div key={item.id} className="bg-white flex justify-center items-center p-10 rounded-xl gap-10">
                            <Image width={100} height={100} src={item.img} alt={item.title} className="w-1/4 h-auto object-cover rounded-xl" unoptimized />
                            <div className="content">
                                <h2 className="text-xl h-[65px] font-bold text-[#0A3484] mt-6 mb-4">{item.title}</h2>
                                <p className="text-gray-500 h-[85px] overflow-hidden text-ellipsis">{item.description}</p>



                                <p className="text-[#F60462]">
                                    Any Amount
                                </p>

                                {/* donate */}
                                <div className="flex justify-start items-center gap-5">
                                <button className="bg-[#F60462] text-white rounded-md px-8 py-2 block mt-6">Donate Now</button>
                                <button className="bg-[#0A3484] text-white rounded-md px-8 py-2 block mt-6">Explore more Apeals</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SingleFilter