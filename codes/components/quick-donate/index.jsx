
import Image from 'next/image';
import React, { useState } from 'react'

const QuickDonate = () => {
    const [selectedAmount, setSelectedAmount] = useState(null);

    const handleRadioChange = (event) => {
        setSelectedAmount(event.target.id);
    };

    return (
        <div className='quick-donate py-5 bg-[#00A3DA]'>
            <div className="container max-w-7xl mx-auto">
                <form action="" className='flex justify-center items-center gap-2'>
                    <div className="bg-white h-[50px] rounded-md flex justify-between items-center gap-2 overflow-hidden">
                        <select name="" className='py-3 px-4 text-black border-0 shadow-none outline-none' id="">
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                        </select>
                        <div className="h-[30px] w-[1px] bg-gray-300"></div>
                        <input type="text" className='py-3 px-4 text-black border-0 shadow-none outline-none' placeholder='amount' />
                    </div>
                    {['hundred', 'twohundred', 'fivehundred'].map((amount, index) => (
                        <label
                            key={index}
                            htmlFor={amount}
                            className={`px-8 py-3 h-[50px] flex justify-center items-center rounded-md ${selectedAmount === amount || (!selectedAmount && index === 0) ? 'bg-[#F60462]' : 'bg-white'} active-${index}`}
                        >
                            <input
                                type="radio"
                                name='amount'
                                id={amount}
                                onChange={handleRadioChange}
                                className="hidden"
                                defaultChecked={index === 0}
                            />
                            <span className={`${selectedAmount === amount || (!selectedAmount && index === 0) ? 'text-white' : 'text-black'}`}>
                                ${amount === 'hundred' ? '100' : amount === 'twohundred' ? '200' : '500'}
                            </span>
                        </label>
                    ))}
                    <div className="bg-white h-[50px] rounded-md flex justify-between items-center gap-2 overflow-hidden">
                        <select name="" className='py-3 px-4 text-black border-0 shadow-none outline-none' id="">
                            <option value="Save Life in Gaza">Save Life in Gaza</option>
                            <option value="Save Life in Syria">Save Life in Syria</option>
                            <option value="Save Life in Yemen">Save Life in Yemen</option>
                        </select>
                        <div className="h-[30px] py-4 w-[1px] bg-white"></div>
                    </div>
                    <Image src='/img/gatways.png' className='bg-[#80CEFE] h-[50px] px-4 py-2 flex justify-center items-center object-contain rounded-md' width={200} height={50} alt='quick donate' />
                    <button className='btn btn-glow h-[50px]' type='submit'>Quick Donate</button>
                </form>
            </div>
        </div>
    )
}

export default QuickDonate