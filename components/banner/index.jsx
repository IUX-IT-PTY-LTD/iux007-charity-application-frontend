import Image from 'next/image'
import React from 'react'
import Slider from 'react-slick';

const Banner = () => {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const sliderData = [
        {
            id: 1,
            img: '/img/1.jpg',
            link: "/"
        },
        {
            id: 2,
            img: '/img/2.jpeg',
            link: "/"
        },
        {
            id: 3,
            img: '/img/3.jpg',
            link: "/"
        },
        {
            id: 4,
            img: '/img/4.jpg',
            link: "/"
        },
        {
            id: 5,
            img: '/img/5.jpg',
            link: "/"
        },
        {
            id: 6,
            img: '/img/6.jpg',
            link: "/"
        },
        {
            id: 7,
            img: '/img/7.jpg',
            link: "/"
        },
    ]
    return (
        <div className='banner py-10 bg-white'>
            {/* <Image src='/img/banner.jpg' alt='banner' width={100} height={100} className='w-full h-auto' objectFit='cover' unoptimized /> */}


            <div className="max-w-7xl container mx-auto">
                <Slider {...settings}>
                    {
                        sliderData.map((slide) => (
                            <a href={slide.link} key={slide.id} target='_blank'>
                                <Image src={slide.img} alt='banner' width={100} height={100} className='w-full h-auto' unoptimized />
                            </a>
                        ))
                    }
                </Slider>
            </div>

        </div>
    )
}

export default Banner