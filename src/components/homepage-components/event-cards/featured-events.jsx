import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { useState, useEffect } from'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUserCart } from '@/store/features/userSlice';
import { toast, ToastContainer } from 'react-toastify';

const FeaturedEventsCard = ({
  eventId,
  title,
  description,
  img,
  time,
  venue,
  buttonText,
  fixedDonation,
  donationAmount,
}) => {
  const router = useRouter();
  const dispatch = useDispatch(); // Assuming you have a dispatch function from your Redux store
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  useEffect(() => {
    if (selectedAmount) {
      setCustomAmount(selectedAmount);
    }
  }, [selectedAmount]);

  const handleDonation = async (e) => {
    e.preventDefault();
    const amount = fixedDonation ? donationAmount : (selectedAmount || customAmount);
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid donation amount', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const donationItem = {
      id: eventId,
      title: title,
      amount: amount,
      image: img,
      quantity: 1,
      price: fixedDonation ? donationAmount : amount,
      isFixedDonation: fixedDonation,
    };

    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    if (!existingCart.some((item) => item.id === donationItem.id)) {
      existingCart.push(donationItem);
      localStorage.setItem('cartItems', JSON.stringify(existingCart));
      dispatch(setUserCart(existingCart));
    }
    
    router.push('/checkout');
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mx-auto max-w-sm">
      <ToastContainer />
      <div className="relative">
        <Link href={`/events/${eventId}`}>
          <Image
            width={400}
            height={300}
            src={img}
            alt={title}
            className="w-full h-[200px] object-cover cursor-pointer"
            loader={({ src }) => src}
          />
        </Link>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex gap-3 text-white text-xs">
            <span className="flex items-center gap-1">
              <FaClock className="text-primary" /> {time}
            </span>
            <span className="flex items-center gap-1">
              <FaMapMarkerAlt className="text-primary" /> {venue}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Link href={`/events/${eventId}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 line-clamp-2 cursor-pointer hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
        <div className="space-y-4">
          {fixedDonation ? (
            <div className="text-center text-2xl font-bold text-primary mb-4">
              ${donationAmount}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-1">
                {['50', '100', '200'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`${
                      selectedAmount === amount
                        ? 'bg-primary text-white'
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                    } px-3 py-1.5 rounded-lg text-sm transition-colors duration-200`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter any amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </>
          )}

          <div className="buttons block relative mt-4 w-full hover-breath-border cursor-pointer">
            <button
              onClick={handleDonation}
              className={`${
                !fixedDonation && !selectedAmount && !customAmount
                  ? 'bg-gray-400'
                  : 'bg-primary'
              } text-sm h-full text-white px-5 py-2 rounded-md block text-center w-full`}
            >
              {buttonText || 'Quick Donate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEventsCard;
