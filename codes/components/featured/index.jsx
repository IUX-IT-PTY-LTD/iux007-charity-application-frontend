import Image from 'next/image'
import React from 'react'

const Featured = () => {
    return (
        <div className='bg-white py-10'>
            <div className="w-full flex flex-wrap justify-center items-center md:container mx-auto pt-6 px-4 md:px-0">
                <div className="basis-full flex gap-x-10 flex-wrap sm:flex-nowrap">
                    <div className="basis-full sm:basis-1/2">
                        <Image src="/img/featured.jpg" width={100} height={100} alt="Islamic Donation for emergency appeals" className="rounded-lg w-full h-auto" unoptimized />
                    </div>
                    <div className="basis-full sm:basis-1/2 flex justify-center items-start flex-col">
                        <p className="text-[#253B7E] text-[25px] leading-[30px] my-4 font-bold">Palestine still needs<span className="text-[#F60362] ml-1">you!</span>
                        </p>
                        <p className="text-[#78716C] leading-[19px] sm:leading-6 md:text-[18px] font-brandingMedium">The people of Palestine continue to suffer as famine looms and hunger becomes widespread. Families are being forced to live on less than a can of beans a day. Reports show malnourished newborns are so small that they weigh in at a little more than a kilo. Desperation for food is widespread, affecting the most vulnerable first, including orphaned children. Food assistance to combat famine is desperately needed.</p>
                        <p className="text-[#253B7E] text-[18px] leading-[25px] my-4 font-bold">Help us save Palestinian families and orphans with your Sadaqah today.</p>
                        <div className="flex items-center flex-col sm:flex-row mt-6 w-full">
                            <button type="submit" className="flex items-center justify-center text-center font-bold rounded-md px-4 text-[12px] md:text-[14px] h-[42px] md:h-[44px] transition duration-150 ease-in-out uppercase mb-2 sm:mb-0 min-w-[226px] bg-[#f60362] text-white focus:bg-[#00a3da] focus:outline-none focus:ring-0 active:bg-[#00a3da] hover:bg-[#00a3da]">
                                <span>donate now</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Featured