import Image from 'next/image'
import React from 'react'

const FilterableCards = () => {
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
        {
            id: 3,
            name: 'Top Apeals',
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
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filters.find((filter) => filter.id === activeFilter).items.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl p-4">
                            <Image width={100} height={100} src={item.img} alt={item.title} className="w-full h-auto object-cover rounded-xl" unoptimized />
                            <h2 className="text-xl h-[65px] font-bold text-[#0A3484] mt-6 mb-4">{item.title}</h2>
                            <p className="text-gray-500 h-[85px] overflow-hidden text-ellipsis">{item.description}</p>
                            {/* range */}
                            <div className="w-full rounded-md overflow-hidden h-2 bg-gray-100 mt-6">
                                <div className="h-full rounded-md bg-[#F60462]" style={{ width: `${(item.collected / item.goal) * 100}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <p className="text-gray-500">{item.supporters} Supporters</p>
                                    <p className="text-gray-500">{item.dayLeft} Days Left</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Goal: ${item.goal}</p>
                                    <p className="text-gray-500">Collected: ${item.collected}</p>
                                </div>
                            </div>

                            {/* donate */}
                            <button className="bg-[#F60462] text-white rounded-full px-8 py-2 block ml-auto mt-6">Donate</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FilterableCards