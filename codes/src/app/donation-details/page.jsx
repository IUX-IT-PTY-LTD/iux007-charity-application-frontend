import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'

const DonationDetails = () => {
    return (
        <div className='donation-details py-10'>
            <div className="container mx-auto">
                <div className="text-center">
                    <h2 className='text-3xl font-bold langar'>
                        Event Name
                    </h2>
                </div>

                <div className="grid lg:w-[90%] w-full mx-auto bg-white p-10 shadow-xl rounded-[10px] border mt-10 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
                    <div className="xl:col-span-4 lg:col-span-3 md:col-span-2 col-span-1">
                        {/* back button */}
                        <div className="flex items-center">
                            <Link href={"/"} className='px-3 py-2 bg-primary text-white rounded-[10px]'>
                                <FaArrowLeft className='inline-block mr-2' />
                                Back
                            </Link>
                        </div>
                    </div>
                    <div className="image col-span-1">
                        <Image unoptimized width={100} height={100} className='w-full rounded-[10px]' src="/assets/img/event-img.jpg" alt="Event Name" />
                    </div>
                    <div className="content xl:col-span-3 lg:col-span-2 col-span-1">
                        <h3 className='text-xl mb-4 font-bold langar'>
                            Event Name
                        </h3>
                        <p className='text-gray-500 mt-1 text-lg'>
                            Our Hot Meals for 100 Orphans program provides warm, nutritious meals to children in need this winter. Each meal brings essential nourishment and reminds them they are valued. With your support, we can bring comfort and hope to these 100 young hearts. Donate today to fill their plates—and hearts—with warmth this winter.
                        </p>

                        <form action="" className='flex gap-5 mt-10'>
                            <select name="" className='currency border px-4 py-2 rounded-md w-full appearance-none' id="">
                                <option value="USD">USD</option>
                                <option value="PKR">PKR</option>
                                <option value="EUR">EUR</option>
                            </select>
                            <select name="" className='timeline border px-4 py-2 rounded-md w-full appearance-none' id="">
                                <option value="Single">Single</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                            <input type="number" placeholder='Amount' className='amount border px-4 py-2 rounded-md w-full' />
                            <button className='px-5 py-2 bg-primary text-white rounded-md'>
                                Donate
                            </button>
                        </form>
                    </div>
                </div>


                <div className="grid grid-cols-12 md:grid-cols-10 lg:grid-cols-8 mt-20 mb-10">
                    <div className="lg:col-start- xl:col-start-2 col-span-12 lg:col-span-10 xl:col-span-6 mt-2 mb-8">
                        <div className="grid grid-cols-10 md:grid-cols-12 gap-1 md:gap-4 px-2 md:px-0">
                            <div className="col-start-1 md:col-start-2 col-span-2 px-1 md:px-4">
                                <Image src="/assets/img/paypal2.png" width={100} height={10} alt="" className="w-auto h-[100px] mx-auto" />
                            </div>
                            <div className="col-span-2 px-1 md:px-4">
                                <Image src="/assets/img/visa.png" width={100} height={100} alt="" className="w-auto h-[100px] mx-auto" />
                            </div><div className="col-span-2 px-1 md:px-4">
                                <Image src="/assets/img/master.png" width={100} height={100} alt="" className="w-auto h-[100px] mx-auto" />
                            </div>
                            <div className="col-span-2 px-1 md:px-4">
                                <Image src="/assets/img/apple-pay.png" width={100} height={100} alt="" className="w-auto h-[100px] mx-auto" />
                            </div><div className="col-span-2 px-1 md:px-4">
                                <Image src="/assets/img/google-pay.png" width={100} height={100} alt="" className="w-auto h-[100px] mx-auto" />
                            </div>
                        </div>
                    </div>
                    <div className="col-start-1 lg:col-start-2 xl:col-start-2 col-span-12 lg:col-span-10 xl:col-span-6 mt-2">
                        <div className="grid grid-cols-12">
                            <div className="col-span-4 flex flex-col justify-center items-center">
                                <div className="border border-stone-200 rounded-full p-4 flex justify-center items-center bg-stone-50 text-green-700 w-14">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <span className="text-stone-500 mt-2 font-medium text-center min-h-[30px] text-[8px] sm:text-sm md:text-md lg:text-lg">100% Secure Checkout</span>
                            </div>
                            <div className="col-span-4 flex flex-col justify-center items-center">
                                <div className="border border-stone-200 rounded-full p-4 flex justify-center items-center bg-stone-50 text-green-700 w-14">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <span className="text-stone-500 mt-2 font-medium text-center min-h-[30px] text-[8px] sm:text-sm md:text-md lg:text-lg">
                                    100% Donation Policy
                                </span>
                            </div>
                            <div className="col-span-4 flex flex-col justify-center items-center">
                                <div className="border border-stone-200 rounded-full p-4 flex justify-center items-center bg-stone-50 text-green-700 w-14">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd">
                                        </path>
                                    </svg>
                                </div>
                                <span className="text-stone-500 mt-2 font-medium text-center min-h-[30px] text-[8px] sm:text-sm md:text-md lg:text-lg">
                                    We Protect Your Privacy
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DonationDetails