'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, use } from 'react';
import { FaArrowLeft, FaStar } from 'react-icons/fa';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { useRouter } from 'next/navigation';
import { setUserCart } from '@/store/features/userSlice';
import { useDispatch } from 'react-redux';

const EventDetails = props => {
  const params = use(props.params);
  const { id: uuid } = params;
  const router = useRouter();
  const dispatch = useDispatch();

  const [event, setEvent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(0);
  const [qurbaniDay, setQurbaniDay] = useState('');
  
  // Qurbani-specific state
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedAnimalPrice, setSelectedAnimalPrice] = useState(0);
  const [qurbaniUnits, setQurbaniUnits] = useState(1);
  const [qurbaniNames, setQurbaniNames] = useState([{ name: '', address: '', motherName: '', fatherName: '' }]);
  const [qurbaniLocation, setQurbaniLocation] = useState('australia'); // 'australia' or 'overseas'

  const handleDonation = async (e) => {
    e.preventDefault();
    
    let donationAmountValue;
    let qurbaniData = null;

    // Handle Qurbani donations
    if (event.is_qurbani_donation === 1) {
      if (!selectedAnimal) {
        alert('Please select a Qurbani animal');
        return;
      }
      
      // Validate names are filled
      const incompleteNames = qurbaniNames.some(entry => !entry.name.trim() || !entry.address.trim());
      if (incompleteNames) {
        alert('Please fill in all required fields (Full name, Address)');
        return;
      }

      donationAmountValue = selectedAnimalPrice * qurbaniUnits;
      qurbaniData = {
        animal_type: selectedAnimal,
        animalPrice: selectedAnimalPrice,
        qurbani_location: qurbaniLocation,
        units: qurbaniNames.map(nameEntry => ({
          name: nameEntry.name,
          address: nameEntry.address,
          father_name: nameEntry.fatherName,
          mother_name: nameEntry.motherName,
          qurbani_day: nameEntry.qurbaniDay,
        })),
        totalAmount: donationAmountValue
      };
    } else {
      // Handle regular donations
      donationAmountValue = document.getElementById('donation_amount').value;
      if (!donationAmountValue || donationAmountValue <= 0) {
        e.preventDefault();
        alert('Please enter a valid donation amount');
        return;
      }
    }

    const donationItem = {
      id: event.uuid,
      title: event.title,
      amount: donationAmountValue,
      image: event.featured_image,
      quantity: event.is_qurbani_donation === 1 ? qurbaniUnits : 1,
      price: event.is_fixed_donation
        ? event.price
        : event.is_qurbani_donation === 1
          ? selectedAnimalPrice
          : donationAmountValue,
      isFixedDonation: event.is_fixed_donation,
      isQurbaniDonation: event.is_qurbani_donation === 1,
      qurbaniData: qurbaniData,
      // Qurbani-specific payload fields
      ...(event.is_qurbani_donation === 1 && {
        animal_type: selectedAnimal,
        qurbani_location: qurbaniLocation,
        units: qurbaniNames.map(nameEntry => ({
          name: nameEntry.name,
          address: nameEntry.address,
          father_name: nameEntry.fatherName,
          mother_name: nameEntry.motherName
        }))
      })
    };

    // Add donation item to cart state
    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    // Check for duplicates before adding (considering Qurbani vs regular donations)
    const existingItemIndex = existingCart.findIndex(item => {
      if (item.id === donationItem.id) {
        if (item.isQurbaniDonation && donationItem.isQurbaniDonation) {
          // For Qurbani, check if same animal type
          return item.qurbaniData?.animal_type === donationItem.qurbaniData?.animal_type;
        }
        return !item.isQurbaniDonation && !donationItem.isQurbaniDonation;
      }
      return false;
    });

    if (existingItemIndex === -1) {
      existingCart.push(donationItem);
    } else {
      // Update existing item
      existingCart[existingItemIndex] = donationItem;
    }
    
    localStorage.setItem('cartItems', JSON.stringify(existingCart));
    dispatch(setUserCart(existingCart));
    router.push('/checkout');
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await apiService.get(ENDPOINTS.EVENTS.DETAILS(uuid));
        const data = response.data;
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchEventDetails();
    }
  }, [uuid]); // Added uuid dependency

  // Calculate dynamic progress percentage
  const progressPercentage = event.remaining_percentage 
    ? (100 - event.remaining_percentage).toFixed(2)
    : event.target_amount > 0 
      ? Math.min((event.total_donation / event.target_amount) * 100, 100).toFixed(2)
      : 0;

  // Determine progress bar color based on progress percentage
  const getProgressBarColor = () => {
    if (parseFloat(progressPercentage) > 70) {
      return 'bg-green-500';
    }
    return 'bg-primary';
  };

  const shouldShowQuickAmounts =
    event.is_qurbani_donation !== 1 &&
    event.is_fixed_donation == 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  // get event details from api
  // set event details to state
  // return event details information
  return (
    <div className="donation-details py-10">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            {/* <Link
              href="/"
              className="inline-flex items-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </Link> */}
          </div>

          <div className="bg-white p-6 shadow-lg rounded-xl border">
            <div className="flex flex-col gap-8">
              {/* Centered Image Section */}
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  {event.featured_image ? (
                    <Image
                      unoptimized
                      width={400}
                      height={300}
                      className="w-full h-[300px] object-cover rounded-lg shadow-md"
                      src={event.featured_image}
                      alt={event.title}
                      loader={({ src }) => src}
                    />
                  ) : (
                    <div className="w-full h-[300px] bg-gray-200 animate-pulse rounded-lg flex items-center justify-center shadow-md">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold langar mb-4">{event.title}</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">{event.description}</p>
                </div>

                {/* Qurbani Selection Section */}
                {event.is_qurbani_donation === 1 && event.qurbani_pricing && (
                  <div className="mx-auto mb-8">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200">
                      <div className="flex items-center justify-center gap-2 mb-6">
                        <FaStar className="text-amber-500 text-xl" />
                        <h3 className="text-2xl font-bold text-amber-900">Select Your Qurbani</h3>
                        <FaStar className="text-amber-500 text-xl" />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {/* Cow Option */}
                        {event.qurbani_pricing.cow_price && (
                          <div 
                            className={`bg-white p-6 rounded-lg border-2 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                              selectedAnimal === 'cow' ? 'border-blue-500 bg-blue-50' : 'border-blue-200 hover:border-blue-300'
                            }`}
                            onClick={() => {
                              setSelectedAnimal('cow');
                              setSelectedAnimalPrice(Number.parseFloat(event.qurbani_pricing.cow_price));
                            }}
                          >
                            <div className="text-center">
                              <div className="text-4xl mb-3">🐄</div>
                              <p className="text-lg font-semibold text-blue-700 mb-2">Cow</p>
                              <p className="text-2xl font-bold text-blue-900">
                                ${Number.parseFloat(event.qurbani_pricing.cow_price).toFixed(2)}
                              </p>
                              {selectedAnimal === 'cow' && (
                                <div className="mt-3">
                                  <div className="w-6 h-6 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Goat Option */}
                        {event.qurbani_pricing.goat_price && (
                          <div 
                            className={`bg-white p-6 rounded-lg border-2 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                              selectedAnimal === 'goat' ? 'border-green-500 bg-green-50' : 'border-green-200 hover:border-green-300'
                            }`}
                            onClick={() => {
                              setSelectedAnimal('goat');
                              setSelectedAnimalPrice(Number.parseFloat(event.qurbani_pricing.goat_price));
                            }}
                          >
                            <div className="text-center">
                              <div className="text-4xl mb-3">🐐</div>
                              <p className="text-lg font-semibold text-green-700 mb-2">Goat</p>
                              <p className="text-2xl font-bold text-green-900">
                                ${Number.parseFloat(event.qurbani_pricing.goat_price).toFixed(2)}
                              </p>
                              {selectedAnimal === 'goat' && (
                                <div className="mt-3">
                                  <div className="w-6 h-6 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Lamb Option */}
                        {event.qurbani_pricing.lamb_price && (
                          <div 
                            className={`bg-white p-6 rounded-lg border-2 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                              selectedAnimal === 'lamb' ? 'border-orange-500 bg-orange-50' : 'border-orange-200 hover:border-orange-300'
                            }`}
                            onClick={() => {
                              setSelectedAnimal('lamb');
                              setSelectedAnimalPrice(Number.parseFloat(event.qurbani_pricing.lamb_price));
                            }}
                          >
                            <div className="text-center">
                              <div className="text-4xl mb-3">🐑</div>
                              <p className="text-lg font-semibold text-orange-700 mb-2">Lamb</p>
                              <p className="text-2xl font-bold text-orange-900">
                                ${Number.parseFloat(event.qurbani_pricing.lamb_price).toFixed(2)}
                              </p>
                              {selectedAnimal === 'lamb' && (
                                <div className="mt-3">
                                  <div className="w-6 h-6 bg-orange-500 rounded-full mx-auto flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Qurbani Location Toggle */}
                      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Select Qurbani Location</h4>
                        <div className="flex items-center justify-center">
                          <div className="relative bg-gray-100 rounded-lg p-1 flex">
                            <button
                              type="button"
                              onClick={() => setQurbaniLocation('australia')}
                              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                qurbaniLocation === 'australia'
                                  ? 'bg-blue-600 text-white shadow-md'
                                  : 'text-gray-600 hover:text-gray-800'
                              }`}
                            >
                              🇦🇺 Qurbani in Australia
                            </button>
                            <button
                              type="button"
                              onClick={() => setQurbaniLocation('overseas')}
                              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                                qurbaniLocation === 'overseas'
                                  ? 'bg-green-600 text-white shadow-md'
                                  : 'text-gray-600 hover:text-gray-800'
                              }`}
                            >
                              🌍 Qurbani Overseas
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Qurbani Configuration */}
                      {selectedAnimal && (
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">Configure Your {selectedAnimal.charAt(0).toUpperCase() + selectedAnimal.slice(1)} Qurbani</h4>
                          
                          <div className="grid grid-cols-1 gap-6 mb-6">
                            {/* Units Selection */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Units</label>
                              <div className="flex items-center gap-4">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const units = Math.max(1, qurbaniUnits - 1);
                                    setQurbaniUnits(units);
                                    const newNames = Array.from({ length: units }, (_, i) =>
                                      qurbaniNames[i] || { name: '', address: '', motherName: '', fatherName: '' }
                                    );
                                    setQurbaniNames(newNames);
                                  }}
                                  className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center text-lg font-bold transition-colors"
                                  disabled={qurbaniUnits <= 1}
                                >
                                  -
                                </button>
                                <div className="flex-1 text-center">
                                  <span className="text-2xl font-bold text-gray-800">{qurbaniUnits}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const units = qurbaniUnits + 1;
                                    setQurbaniUnits(units);
                                    const newNames = Array.from({ length: units }, (_, i) =>
                                      qurbaniNames[i] || { name: '', address: '', motherName: '', fatherName: '' }
                                    );
                                    setQurbaniNames(newNames);
                                  }}
                                  className="w-10 h-10 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center justify-center text-lg font-bold transition-colors"
                                >
                                  +
                                </button>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Each unit costs ${selectedAnimalPrice.toFixed(2)}</p>
                            </div>
                          </div>

                          {/* Names and Addresses */}
                          <div>
                            <h5 className="text-md font-medium text-gray-800 mb-3">Names and Addresses</h5>
                            <div className="space-y-4">
                              {qurbaniNames.map((nameEntry, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                  <h6 className="text-sm font-medium text-gray-700 mb-2">Person {index + 1}</h6>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Full Name</label>
                                      <input
                                        type="text"
                                        value={nameEntry.name}
                                        onChange={(e) => {
                                          const newNames = [...qurbaniNames];
                                          newNames[index].name = e.target.value;
                                          setQurbaniNames(newNames);
                                        }}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        placeholder="Enter full name"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-gray-600 mb-1">Address</label>
                                      <input
                                        type="text"
                                        value={nameEntry.address}
                                        onChange={(e) => {
                                          const newNames = [...qurbaniNames];
                                          newNames[index].address = e.target.value;
                                          setQurbaniNames(newNames);
                                        }}
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                                        placeholder="Enter address"
                                      />
                                    </div>
                                    <div>
                                      <select
                                        className="flex-1 min-w-[160px] border px-4 py-2.5 rounded-lg bg-white appearance-none"
                                        value={nameEntry.qurbaniDay}
                                        onChange={(e) => {
                                          const newNames = [...qurbaniNames];
                                          newNames[index].qurbaniDay = e.target.value;
                                          setQurbaniDay(newNames);
                                        }}
                                      >
                                        <option value="">Select Qurbani Day</option>
                                        <option value="Qurbani as per Moon Sighting">🌙 Qurbani as per Moon Sighting</option>
                                        <option value="Qurbani As per ANIC">🕌 Qurbani As per ANIC</option>
                                      </select>
                                    </div>
                                   
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Total Price Display */}
                          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <div className="text-center">
                              <p className="text-sm text-amber-700">Total Cost</p>
                              <p className="text-2xl font-bold text-amber-900">
                                ${(selectedAnimalPrice * qurbaniUnits).toFixed(2)}
                              </p>
                              <p className="text-sm text-amber-600">
                                {qurbaniUnits} × {selectedAnimal} at ${selectedAnimalPrice.toFixed(2)} each
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="max-w-2xl mx-auto">

                {/* Regular Donation Section - Only show if NOT Qurbani or no animal selected */}
                {(event.is_qurbani_donation !== 1 || (event.is_qurbani_donation === 1 && !selectedAnimal)) && (
                  <>
                    {shouldShowQuickAmounts ? (
                      <div className="flex flex-wrap justify-center gap-3 mb-6">
                        {[50, 100, 150, 200].map((amount) => (
                          <button
                            key={amount}
                            onClick={(e) => {
                              const amountInput = document.getElementById('donation_amount');
                              if (amountInput) {
                                amountInput.value = amount;
                              }
                              // Remove active class from all buttons
                              document.querySelectorAll('.donation-amount-btn').forEach((btn) => {
                                btn.classList.remove('bg-gray-800');
                                btn.classList.add('bg-gray-100');
                                const span = btn.querySelector('span');
                                if (span) {
                                  span.classList.remove('text-white');
                                  span.classList.add('text-gray-800');
                                }
                              });
                              // Add active class to clicked button
                              e.currentTarget.classList.remove('bg-gray-100');
                              e.currentTarget.classList.add('bg-gray-800');
                              const span = e.currentTarget.querySelector('span');
                              if (span) {
                                span.classList.remove('text-gray-800');
                                span.classList.add('text-white');
                              }
                            }}
                            className="donation-amount-btn bg-gray-100 px-6 py-3 rounded-lg"
                          >
                            <span className="text-xl font-bold text-gray-800">${amount}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-4 rounded-lg flex justify-center items-center gap-3 mb-6 w-fit mx-auto">
                        <span className="text-3xl font-bold text-gray-800">${event.price}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                      <input
                        name="donation_amount"
                        id="donation_amount"
                        type="number"
                        required={event.is_qurbani_donation !== 1}
                        min="1"
                        placeholder="Amount"
                        className="flex-1 min-w-[120px] border px-4 py-2.5 rounded-lg"
                        onChange={(e) => {
                          const value = Number.parseFloat(e.target.value);
                          if (!Number.isNaN(value) && value >= 0) {
                            setAmount(value);
                          }
                        }}
                        value={event.is_fixed_donation ? event.price : amount || undefined}
                        disabled={event.is_fixed_donation || event.is_qurbani_donation === 1}
                      />
                      {event.is_qurbani_donation !== 1 && (
                        <button
                          onClick={handleDonation}
                          className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Donate Now
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* Qurbani Donate Button - Only show when animal is selected */}
                {event.is_qurbani_donation === 1 && selectedAnimal && (
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={handleDonation}
                      className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-lg font-semibold shadow-lg"
                    >
                      Donate ${(selectedAnimalPrice * qurbaniUnits).toFixed(2)} for {qurbaniUnits} {selectedAnimal}{qurbaniUnits > 1 ? 's' : ''}
                    </button>
                  </div>
                )}

                {/* Progress Section - Always show for regular donations */}
                {event.is_qurbani_donation !== 1 && (
                  <div className="mb-6">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex flex-col gap-1 mb-4">
                        <div className="flex items-baseline justify-center">
                          <span className="text-1xl font-bold text-primary">${event.total_donation || 0}</span>
                          <span className="text-gray-500 ml-2">Raised of </span>
                          <span className="text-1xl font-bold text-primary">
                            {' '}
                            ${event.target_amount || 0}
                          </span>
                          <span className="text-gray-500 ml-2">goal</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`${getProgressBarColor()} h-2.5 rounded-full transition-colors duration-300`}
                          style={{
                            width: `${progressPercentage}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">{event.total_donor || 0} Donors</span>
                        <span className="text-sm text-gray-500">
                          {progressPercentage}%
                          Complete
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="max-w-4xl mx-auto mt-16 mb-10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Secure Payment Methods</h3>
            <p className="text-gray-600">We accept all major payment methods for your convenience</p>
          </div>
          <div className="flex justify-center items-center gap-8 mb-12">
            <div className="flex items-center justify-center">
              <Image
                src="/assets/img/visa.png"
                width={120}
                height={80}
                alt="Visa"
                className="w-auto h-[80px]"
              />
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/assets/img/master.png"
                width={120}
                height={80}
                alt="Mastercard"
                className="w-auto h-[80px]"
              />
            </div>
              {/* <div className="col-span-2 px-1 md:px-4">
                <Image
                  src="/assets/img/apple-pay.png"
                  width={100}
                  height={100}
                  alt=""
                  className="w-auto h-[100px] mx-auto"
                />
              </div> */}
              {/* <div className="col-span-2 px-1 md:px-4">
                <Image
                  src="/assets/img/google-pay.png"
                  width={100}
                  height={100}
                  alt=""
                  className="w-auto h-[100px] mx-auto"
                />
              </div> */}
          </div>
          
          <div className="grid grid-cols-12">
            <div className="col-span-4 flex flex-col justify-center items-center">
              <div className="border border-stone-200 rounded-full p-4 flex justify-center items-center bg-stone-50 text-green-700 w-14">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <span className="text-stone-500 mt-2 font-medium text-center min-h-[30px] text-[8px] sm:text-sm md:text-md lg:text-lg">
                100% Secure Checkout
              </span>
            </div>
            <div className="col-span-4 flex flex-col justify-center items-center">
              <div className="border border-stone-200 rounded-full p-4 flex justify-center items-center bg-stone-50 text-green-700 w-14">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
              <span className="text-stone-500 mt-2 font-medium text-center min-h-[30px] text-[8px] sm:text-sm md:text-md lg:text-lg">
                100% Donation Policy
              </span>
            </div>
            <div className="col-span-4 flex flex-col justify-center items-center">
              <div className="border border-stone-200 rounded-full p-4 flex justify-center items-center bg-stone-50 text-green-700 w-14">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
                    clip-rule="evenodd"
                  ></path>
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
  );
};

export default EventDetails;
