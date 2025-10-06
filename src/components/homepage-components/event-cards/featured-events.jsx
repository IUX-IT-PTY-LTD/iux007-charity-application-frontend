import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaClock, FaMapMarkerAlt, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUserCart } from '@/store/features/userSlice';

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
  const [showError, setShowError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    if (selectedAmount) {
      setCustomAmount(selectedAmount);
    }
  }, [selectedAmount]);

  const handleDonation = async (e) => {
    e.preventDefault();
    const amount = fixedDonation ? donationAmount : (selectedAmount || customAmount);
    
    if (!amount || amount <= 0) {
      setShowError(true);
      setShowPopup(true);
      return;
    }
    
    setShowError(false);

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
  };

  const CustomPopup = () => {
    if (!showPopup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-2xl transform transition-all text-center">
          <div className="flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-orange-500 text-xl mr-2" />
            <h3 className="text-base font-semibold text-gray-800">Amount Required</h3>
            <button 
              onClick={() => {
                setShowPopup(false);
                setShowError(false);
              }}
              className="ml-auto text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Please select or enter a valid donation amount to proceed with your donation.
          </p>
          <button
            onClick={() => {
              setShowPopup(false);
              setShowError(false);
            }}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            OK, I'll select an amount
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden mx-auto max-w-sm">
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
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 text-justify">{description}</p>
        <div className="space-y-4">
          {fixedDonation ? (
           <div className="text-center h-[84px] flex flex-col items-center justify-center">
              <div className="text-sm text-gray-600 mb-1">Fixed Donation</div>
              <div className="text-2xl font-bold text-gray-800">
                ${donationAmount}
              </div>
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-3 gap-1 ${showError ? 'animate-pulse' : ''}`}>
                {['50', '100', '200'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setShowError(false);
                    }}
                    className={`${
                      selectedAmount === amount
                        ? 'bg-gray-800 text-white'
                        : showError 
                        ? 'bg-red-100 text-red-600 border border-red-300' 
                        : 'bg-gray-100 text-gray-800'
                    } px-3 py-1.5 rounded-lg text-sm font-medium`}
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
                    setShowError(false);
                  }}
                  className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all ${
                    showError 
                      ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200 focus:border-red-400' 
                      : 'border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                  }`}
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
    <CustomPopup />
    </>
  );
};

export default FeaturedEventsCard;
