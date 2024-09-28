import Image from 'next/image'
import React from 'react'

const Footer = () => {
    return (
        <div className="w-full bg-gradient-to-r from-[#00a3da] to-[#093484] px-2 py-6">
            <div className="md:container mx-auto grid grid-cols-12 px-2 gap-2 md:gap-4">
                <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <ul className="flex flex-col">
                        <li className="w-full pt-2 pb-4">
                            <span className="text-white font-bold text-[20px]">About Us</span>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/ali-banat">About Ali Banat</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/purpose">Purpose</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/gdpr">GDPR</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/Volunteer/">Volunteer</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/contact/">Contact</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/subscription">Regular Giving</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/cancel">Subscriptions Portal</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/fundraising">Fundraise with MATW</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/our-promise">Our Promise</a>
                        </li>
                    </ul>
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <ul className="flex flex-col">
                        <li className="w-full pt-2 pb-4">
                            <span className="text-white font-bold text-[20px]">Resources &amp; Information</span>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light mr-1" href="/faq/">FAQs</a>
                            |<a className="font-light text-sm ml-1" href="/social-media/">Social Media</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/phishing-scams">Scams &amp; Phishing</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/annual-reports/">Annual Reports</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/privacypolicy/">Privacy Policies</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/policies/">Our Policies</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/opt-out/">Opt-out</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="https://blog.matwproject.org/">Blog</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/pdf/uk-terms-refunds.pdf">Terms &amp; Refunds (UK)</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/pdf/global-terms-refunds.pdf">Terms &amp; Refunds (Global)</a>
                        </li>
                    </ul>
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                    <ul className="flex flex-col">
                        <li className="w-full pt-2 pb-4">
                            <span className="text-white font-bold text-[20px]">Quick Links</span>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/sadaqah">Give Sadaqah</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/sadaqah-jariyah/build-a-water-well">Build a Well</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/sadaqah-jariyah/build-a-masjid">Build a Mosque</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/crisis-and-emergencies/palestine">Donate to Palestine</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/sadaqah-jariyah/build-a-water-well">Water Well Donation</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="https://matwproject.org/duas/">Duas</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/sadaqah-jariyah">Sadaqah Jariyah</a>
                        </li>
                        <li className="w-full text-[#c6e9ff] transition-all duration-200 hover:pl-1 py-1">
                            <a className="font-light" href="/100-donation-policy">100% Donation Policy</a>
                        </li>
                    </ul>
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-3 flex flex-col justify-end items-center sm:items-start mt-3 sm:mt-0 px-4">
                    <div>
                        <Image width={100} height={100} src="/" alt="MATW Project" className="mb-3 w-[100px] h-[100px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[60px] lg:h-[60px] xl:w-[80px] xl:h-[80px] 2xl:w-[100px] 2xl:h-[100px]" />
                        <Image width={100} height={100} src="/" alt="MATW Project" className="mb-3 w-[260px] h-[50px] sm:w-[280px] sm:h-[52px] md:w-[335px] md:h-[63px] lg:w-[207px] lg:h-[38px] xl:w-[271px] xl:h-[51px] 2xl:w-[335px] 2xl:h-[63px]" />
                        <Image width={100} height={100} src="/" alt="MATW Project" className="max-w-full w-[260px] h-[35px] sm:w-[280px] sm:h-[36px] md:w-[335px] md:h-[40px] lg:w-[207px] lg:h-[30px] xl:w-[271px] xl:h-[32px] 2xl:w-[335px] 2xl:h-[40px]" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer