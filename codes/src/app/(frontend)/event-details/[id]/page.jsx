'use client';
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from "react";
import { FaArrowLeft } from 'react-icons/fa'
import { apiService } from '@/api/services/apiService';
import { ENDPOINTS } from '@/api/config';

const EventDetails = ({params}) => {
    const {id: uuid} = params;
    console.log(uuid);

    const [event, setEvent] = useState([]);

    const fetchEventDetails = async () => {
        const response = await apiService.get(ENDPOINTS.EVENTS.DETAILS(uuid));
        const data = response.data;
        setEvent(data);
        console.log(data);
    }

    useEffect(() => {
        fetchEventDetails();
    }, []) // Added dependency array to prevent infinite loop

    // get event details from api
    // set event details to state
    // return event details information
    return (
        <div className='donation-details py-10'>
            <div className="container mx-auto">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center mb-6">
                        <Link href="/" className="inline-flex items-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                            <FaArrowLeft className="mr-2" />
                            Back
                        </Link>
                    </div>

                    <div className="bg-white p-6 shadow-lg rounded-xl border">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/3">
                                <Image 
                                    unoptimized 
                                    width={100} 
                                    height={100} 
                                    className="w-full h-[250px] object-cover rounded-lg" 
                                    src={event.featured_image} 
                                    alt={event.title} 
                                />
                            </div>
                            
                            <div className="md:w-2/3">
                                <h2 className="text-2xl font-bold langar mb-4">{event.title}</h2>
                                <p className="text-gray-600 mb-6">{event.description}</p>
                                
                                <div className="bg-primary/5 p-4 rounded-lg inline-flex items-center gap-3 mb-6">
                                    <span className="text-3xl font-bold text-primary">${event.price}</span>
                                    <span className="text-gray-600">Suggested Donation</span>
                                </div>

                                <div className="mb-6">
                                    <div className="bg-gray-100 rounded-lg p-4">
                                        <div className="flex flex-col gap-1 mb-4">
                                            <div className="flex items-baseline">
                                                <span className="text-1xl font-bold text-primary">${25000 || 0}</span>
                                                <span className="text-gray-500 ml-2">USD Raised of </span>
                                                <span className="text-1xl font-bold text-primary"> ${event.target_amount || 0}</span>
                                                <span className="text-gray-500 ml-2">goal</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div 
                                                className="bg-primary h-2.5 rounded-full" 
                                                style={{width: `${(25000 / event.target_amount * 100) || 0}%`}}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-sm text-gray-500">{100 || 0} Donors</span>
                                            <span className="text-sm text-gray-500">{((25000 / event.target_amount * 100) || 0).toFixed(1)}% Complete</span>
                                        </div>
                                    </div>
                                </div>

                                <form action="./checkout" className="flex flex-wrap gap-4">
                                    <select className="flex-1 min-w-[120px] border px-4 py-2.5 rounded-lg bg-white appearance-none">
                                        <option value="USD">🇺🇸 USD</option>
                                        <option value="PKR">🇵🇰 PKR</option>
                                        <option value="EUR">🇪🇺 EUR</option>
                                    </select>
                                    <input 
                                        type="number" 
                                        placeholder="Amount" 
                                        className="flex-1 min-w-[120px] border px-4 py-2.5 rounded-lg" 
                                    />
                                    <button className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                                        Donate Now
                                    </button>
                                </form>
                            </div>
                        </div>
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

export default EventDetails