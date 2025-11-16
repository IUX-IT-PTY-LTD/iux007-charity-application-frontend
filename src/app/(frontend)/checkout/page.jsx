'use client';
import EventCard from '@/components/homepage-components/event-cards/events';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaDonate, FaHandHoldingHeart, FaTrashAlt } from 'react-icons/fa';
import { MdOutlineEmojiPeople } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CustomPaymentForm from '@/components/stripe/CustomPaymentForm';
import { setUserCart } from '@/store/features/userSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import { getConfigValue } from '@/utils/domainConfig';

const Checkout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [userAgreed, setUserAgreed] = useState(false);
  const [adminContributionAmount, setAdminContributionAmount] = useState(0);
  const [adminInputValue, setAdminInputValue] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [checkoutData, setCheckoutData] = useState(null);
  const userInfo = useSelector((state) => state.user.user);
  console.log(userInfo);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  /** Stripe Integration */
  const stripePublishableKey = getConfigValue('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

  useEffect(() => {
    // Check for step parameter from URL (when redirecting back from login)
    const stepParam = searchParams.get('step');
    if (stepParam) {
      setCurrentStep(parseInt(stepParam));
    }

    // Get cart items from localStorage when component mounts
    const cart = localStorage.getItem('cartItems');
    if (cart) {
      const parsedCart = JSON.parse(cart);
      setCartItems(parsedCart);

      // Calculate subtotal from cart items
      const subtotal = parsedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);

      // Set admin contribution amount (5% of subtotal)
      const adminContrib = subtotal * 0.05;
      setAdminContributionAmount(adminContrib);
      setAdminInputValue(adminContrib.toFixed(2));

      // Set total amount (subtotal + admin contribution)
      setTotalAmount(subtotal + adminContrib);

      // Build checkout data structure
      const checkoutDataObj = {
        donations: parsedCart.map((item) => ({
          event_id: item.id,
          quantity: item.quantity,
          amount: item.price,
          notes: item.note || '',
        })),
        currency_id: 1, // Assuming default currency ID is 1
        total_price: subtotal,
        type: 'single',
        admin_contribution: adminContrib,
        payment_intent_id: '', // This will be set after Stripe creates payment intent
      };

      setCheckoutData(checkoutDataObj);
    }
  }, [searchParams]);

  // Update total amount whenever admin contribution changes
  useEffect(() => {
    if (cartItems.length > 0) {
      const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalAmount(subtotal + adminContributionAmount);
    }
  }, [adminContributionAmount, cartItems]);

  // Add this function at the component level:
  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
      );
      // Update localStorage with new cart data
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));

      const newSubtotal = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const newAdminContribution = newSubtotal * 0.05;

      // Update admin contribution first
      setAdminContributionAmount(newAdminContribution);

      // Update total with new subtotal and new admin contribution
      setTotalAmount(newSubtotal + newAdminContribution);

      setCheckoutData({
        ...checkoutData,
        total_price: newSubtotal,
        admin_contribution: newAdminContribution,
        donations: checkoutData.donations.map((donation) =>
          donation.event_id === itemId ? { ...donation, quantity: donation.quantity + 1 } : donation
        ),
      });

      return updatedCart;
    });
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
      // Update localStorage with new cart data
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      const newSubtotal = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const newAdminContribution = newSubtotal * 0.05;
      setAdminContributionAmount(newAdminContribution);

      setTotalAmount(newSubtotal + newAdminContribution);
      setCheckoutData({
        ...checkoutData,
        total_price: newSubtotal,
        admin_contribution: newAdminContribution,
        donations: checkoutData.donations.map((donation) =>
          donation.event_id === itemId ? { ...donation, quantity: donation.quantity - 1 } : donation
        ),
      });
      setAdminContributionAmount(newSubtotal * 0.05);
      return updatedCart;
    });
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== itemId));
    const updatedCart = cartItems.filter((i) => i.id !== itemId);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    setTotalAmount(updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0));
    setAdminContributionAmount(
      updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.05
    );
    dispatch(setUserCart(updatedCart));
  };

  const paymentMethods = [
    {
      id: 'credit-cards',
      name: 'Credit Cards',
      img: '/assets/img/4logos.png',
      description: 'Visa, Mastercard, American Express'
    },
    // {
    //   id: 'commonwealth',
    //   name: 'Commonwealth Bank',
    //   img: '/assets/img/commonwealthBank.jpg', // Using existing image as placeholder
    //   description: 'Commonwealth Bank Gateway'
    // },
    // {
    //   id: 'nab',
    //   name: 'NAB Gateway',
    //   img: '/assets/img/nab.png', // Using existing image as placeholder
    //   description: 'NAB Bank Gateway'
    // },
  ];

  //   payment methods
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(paymentMethods[0]);
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 md:py-16 px-4 sm:px-6 md:px-0">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            {/* Progress Steps */}
            <div className="relative flex justify-between items-center mb-6 sm:mb-8 md:mb-12">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 sm:h-1 -translate-y-1/2 bg-gray-200">
                <div
                  className={`h-full bg-primary transition-all ${
                    currentStep === 1 ? 'w-0' : currentStep === 2 ? 'w-1/2' : 'w-full'
                  }`}
                ></div>
              </div>

              {/* Step indicators */}
              {[
                { icon: <FaHandHoldingHeart />, label: 'Donation' },
                { icon: <MdOutlineEmojiPeople />, label: 'Donor' },
                { icon: <FaDonate />, label: 'Payment' },
              ].map((step, index) => (
                <div key={index} className="relative z-10 text-center flex-1">
                  <div
                    className={`w-10 h-10 sm:w-12 md:w-14 lg:w-16 h-10 sm:h-12 md:h-14 lg:h-16 mx-auto flex items-center justify-center rounded-full border-2 transition-all ${
                      currentStep > index
                        ? 'bg-primary border-primary text-white'
                        : currentStep === index
                          ? 'bg-primary border-primary text-white animate-pulse'
                          : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    <div className="text-sm sm:text-base md:text-lg lg:text-2xl">{step.icon}</div>
                  </div>
                  <div
                    className={`mt-1 sm:mt-2 md:mt-3 font-medium text-xs sm:text-sm md:text-base ${
                      currentStep >= index + 1 ? 'text-primary' : 'text-gray-400'
                    }`}
                  >
                    <div className="hidden sm:block">{step.label}</div>
                    <div className="block sm:hidden text-xs">
                      {index === 0 && 'Cart'}
                      {index === 1 && 'User'}
                      {index === 2 && 'Pay'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Step 1: Cart */}
            {currentStep === 1 && (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex justify-center md:justify-start items-center">
                  <Link
                    href="/events"
                    className="inline-flex items-center px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-xs sm:text-sm md:text-base w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <span className="mr-2">Add More Items</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </Link>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden mb-3 sm:mb-4 md:mb-6 hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="p-3 sm:p-4 md:p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
                            {/* Image and Details Section */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 w-full lg:w-auto">
                              <div className="w-full sm:w-32 lg:w-48 h-24 sm:h-32 lg:h-48 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  width={192}
                                  height={192}
                                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                  loader={({ src }) => src}
                                />
                              </div>

                              <div className="flex-grow space-y-2 sm:space-y-3 lg:space-y-4 w-full">
                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 hover:text-primary transition-colors line-clamp-2">
                                  {item.title}
                                </h3>

                                {/* Quantity Controls */}
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
                                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                    <button
                                      onClick={() =>
                                        item.quantity > 1 ? handleDecreaseQuantity(item.id) : null
                                      }
                                      className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm sm:text-base"
                                      disabled={item.quantity <= 1}
                                    >
                                      -
                                    </button>
                                    <span className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 font-medium border-x border-gray-200 bg-white text-sm sm:text-base">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => handleIncreaseQuantity(item.id)}
                                      className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm sm:text-base"
                                    >
                                      +
                                    </button>
                                  </div>

                                  <input
                                    type="number"
                                    placeholder="Amount"
                                    className="w-20 sm:w-24 md:w-32 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm transition-all"
                                    disabled={item.isFixedDonation}
                                    value={item.price}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setCartItems((prev) =>
                                        prev.map((i) =>
                                          i.id === item.id
                                            ? { ...i, price: value ? parseFloat(value) : i.price }
                                            : i
                                        )
                                      );
                                    }}
                                  />
                                </div>

                                {/* Notes Section */}
                                <div className="relative">
                                  <textarea
                                    placeholder="Add a note for this item..."
                                    className="w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm transition-all resize-none"
                                    value={item.note || ''}
                                    onChange={(e) => {
                                      const note = e.target.value;
                                      setCartItems((prev) =>
                                        prev.map((i) => (i.id === item.id ? { ...i, note } : i))
                                      );
                                      const updatedCart = cartItems.map((i) =>
                                        i.id === item.id ? { ...i, note } : i
                                      );
                                      localStorage.setItem(
                                        'cartItems',
                                        JSON.stringify(updatedCart)
                                      );
                                    }}
                                    rows={2}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Price and Actions Section */}
                            <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between lg:justify-start gap-3 lg:gap-4">
                              <div className="text-left lg:text-right">
                                <div className="text-xs sm:text-sm text-gray-500">Total Price</div>
                                <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>

                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-2 sm:p-3 text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 group"
                              >
                                <FaTrashAlt className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:scale-110 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center">
                      <p className="text-xl font-semibold text-gray-400">Your cart is empty</p>
                    </div>
                  )}
                </div>

                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t">
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Want to Contribute to Admin?
                      </h3>
                      <span className="inline-block mt-2 px-2 sm:px-3 py-1 text-xs font-medium text-white bg-primary rounded-full">
                        One Time Contribution Only
                      </span>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <input
                          type="text"
                          value={adminInputValue}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            // Allow typing numbers and decimal point
                            if (inputValue === '' || /^\d*\.?\d*$/.test(inputValue)) {
                              setAdminInputValue(inputValue);
                              const numValue = parseFloat(inputValue) || 0;
                              setAdminContributionAmount(Math.max(0, numValue));
                            }
                          }}
                          onBlur={() => {
                            // Format the value when focus is lost
                            const numValue = parseFloat(adminInputValue) || 0;
                            setAdminInputValue(numValue.toFixed(2));
                            setAdminContributionAmount(numValue);
                          }}
                          placeholder="0.00"
                          className="w-full sm:w-32 sm:w-40 lg:w-48 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 focus:border-primary text-sm transition-all"
                        />
                        <span className="text-xs sm:text-sm text-gray-500">
                          (Suggested: ${(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) * 0.05).toFixed(2)})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:border-l lg:pl-6 sm:pl-4">
                    <div className="space-y-4 sm:space-y-6">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Order Summary</h3>

                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                          <span className="font-semibold text-sm sm:text-base">${totalAmount}</span>
                        </div>

                        <button
                          onClick={() => setCurrentStep(2)}
                          className="w-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 text-sm sm:text-base md:text-base text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                          disabled={cartItems.length === 0}
                        >
                          Proceed to Donor Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Donor Details */}
            {currentStep === 2 && (
              <>
                {!isAuthenticated ? (
                  <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-semibold">Please Sign In to Continue</h3>
                      <p className="text-gray-600">Sign in for a faster checkout experience</p>
                      <button
                        onClick={() => router.push('/login?redirect=' + encodeURIComponent('/checkout?step=2'))}
                        className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                      >
                        Sign In
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 border-t">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
                      >
                        Back to Cart
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-8">
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-semibold">Welcome, {userInfo?.name}</h3>
                      <p className="text-gray-600">Please review your information below</p>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-left">
                          <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-medium">{userInfo?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{userInfo?.email}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-green-600 font-medium">You can proceed to payment</p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 border-t">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
                      >
                        Back to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentStep(3);
                          setShowPaymentForm(false);
                          setUserAgreed(false);
                        }}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors order-1 sm:order-2"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="max-w-4xl mx-auto space-y-8">
                {!showPaymentForm ? (
                  /* Confirmation Preview */
                  <>
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Donation</h3>
                      <p className="text-gray-600">Please review your donation details before proceeding to payment</p>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
                      <h4 className="text-xl font-semibold text-gray-900 border-b pb-4">Donation Summary</h4>
                      
                      {/* Cart Items Breakdown */}
                      <div className="space-y-3 sm:space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 py-3 sm:py-4 border-b border-gray-100">
                            <div className="flex items-start space-x-3 sm:space-x-4">
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={80}
                                height={80}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0"
                                loader={({ src }) => src}
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">{item.title}</h5>
                                <p className="text-gray-600 text-xs sm:text-sm">Quantity: {item.quantity}</p>
                                <p className="text-gray-600 text-xs sm:text-sm">Amount per item: ${Number(item.price || 0).toFixed(2)}</p>
                                {item.note && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">Note: {item.note}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right sm:text-left lg:text-right">
                              <p className="text-base sm:text-lg font-semibold text-primary">
                                ${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals Breakdown */}
                      <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                        <div className="flex justify-between text-gray-700">
                          <span>Subtotal (Donations):</span>
                          <span>${(Number(totalAmount || 0) - Number(adminContributionAmount || 0)).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-700">
                          <span>Admin Contribution:</span>
                          <span>${Number(adminContributionAmount || 0).toFixed(2)}</span>
                        </div>
                        <hr className="border-gray-300" />
                        <div className="flex justify-between text-xl font-bold text-gray-900">
                          <span>Total Amount:</span>
                          <span className="text-primary">${Number(totalAmount || 0).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Terms and Agreement */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="agreement"
                            checked={userAgreed}
                            onChange={(e) => setUserAgreed(e.target.checked)}
                            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                          />
                          <label htmlFor="agreement" className="text-sm text-gray-700 leading-relaxed">
                            I agree to the terms and conditions and confirm that all donation details are correct. 
                            I understand that this donation is final and will be processed immediately upon payment confirmation.
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 border-t">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors order-2 sm:order-1"
                      >
                        Back to Donor Details
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPaymentForm(true)}
                        disabled={!userAgreed}
                        className={`w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg transition-colors order-1 sm:order-2 ${
                          userAgreed
                            ? 'text-white bg-primary hover:bg-primary/90'
                            : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                        }`}
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </>
                ) : (
                  /* Payment Form */
                  <>
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h3>
                      <p className="text-gray-600">Total: ${Number(totalAmount || 0).toFixed(2)}</p>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
                      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Select Payment Method</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            onClick={() => setSelectedPaymentMethod(method)}
                            className={`relative cursor-pointer rounded-xl border-2 p-3 sm:p-4 lg:p-6 transition-all duration-200 ${
                              selectedPaymentMethod.id === method.id
                                ? 'border-primary bg-primary/5 shadow-lg'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                          >
                            {selectedPaymentMethod.id === method.id && (
                              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-4 h-4 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            <div className="text-center space-y-2 sm:space-y-3">
                              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto rounded-lg overflow-hidden flex items-center justify-center bg-gray-50">
                                <Image
                                  src={method.img}
                                  alt={method.name}
                                  width={60}
                                  height={40}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                              <div>
                                <h5 className="font-semibold text-gray-900 text-sm sm:text-base">{method.name}</h5>
                                <p className="text-xs sm:text-sm text-gray-600">{method.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Form Based on Selected Method */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h4 className="text-xl font-semibold text-gray-900 mb-6">
                        Pay with {selectedPaymentMethod.name}
                      </h4>
                      
                      {selectedPaymentMethod.id === 'credit-cards' ? (
                        // Credit Cards - Stripe Payment
                        <div className="grid">
                          {!stripePublishableKey ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                              <h3 className="text-lg font-semibold text-red-800 mb-2">Payment Configuration Error</h3>
                              <p className="text-red-600 mb-4">
                                Stripe payment is not properly configured. Please contact support.
                              </p>
                              <button
                                onClick={() => setShowPaymentForm(false)}
                                className="px-4 md:px-6 py-2 text-sm md:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Go Back
                              </button>
                            </div>
                          ) : stripePromise ? (
                            <Elements stripe={stripePromise}>
                              <CustomPaymentForm totalAmount={totalAmount} donationData={checkoutData} />
                            </Elements>
                          ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                              <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Payment System...</h3>
                              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                          )}
                        </div>
                      ) : selectedPaymentMethod.id === 'commonwealth' ? (
                        // Commonwealth Bank Gateway
                        <div className="space-y-6">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <Image
                                src={selectedPaymentMethod.img}
                                alt="Commonwealth Bank"
                                width={40}
                                height={40}
                                className="rounded"
                              />
                              <div>
                                <h5 className="font-semibold text-gray-900">Commonwealth Bank Gateway</h5>
                                <p className="text-sm text-gray-600">Secure payment via Commonwealth Bank</p>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border">
                              <p className="text-sm text-gray-700 mb-4">
                                You will be redirected to Commonwealth Bank's secure payment gateway to complete your transaction.
                              </p>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Amount:</span>
                                  <span className="ml-2">${Number(totalAmount || 0).toFixed(2)}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Currency:</span>
                                  <span className="ml-2">AUD</span>
                                </div>
                              </div>
                            </div>
                            <button
                              className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              onClick={() => {
                                // TODO: Implement Commonwealth Bank gateway redirect
                                alert('Commonwealth Bank payment integration coming soon!');
                              }}
                            >
                              Continue to Commonwealth Bank
                            </button>
                          </div>
                        </div>
                      ) : selectedPaymentMethod.id === 'nab' ? (
                        // NAB Gateway
                        <div className="space-y-6">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <div className="flex items-center space-x-3 mb-4">
                              <Image
                                src={selectedPaymentMethod.img}
                                alt="NAB Gateway"
                                width={40}
                                height={40}
                                className="rounded"
                              />
                              <div>
                                <h5 className="font-semibold text-gray-900">NAB Gateway</h5>
                                <p className="text-sm text-gray-600">Secure payment via NAB Bank</p>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border">
                              <p className="text-sm text-gray-700 mb-4">
                                You will be redirected to NAB's secure payment gateway to complete your transaction.
                              </p>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Amount:</span>
                                  <span className="ml-2">${Number(totalAmount || 0).toFixed(2)}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Currency:</span>
                                  <span className="ml-2">AUD</span>
                                </div>
                              </div>
                            </div>
                            <button
                              className="w-full mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                              onClick={() => {
                                // TODO: Implement NAB gateway redirect
                                alert('NAB Gateway payment integration coming soon!');
                              }}
                            >
                              Continue to NAB Gateway
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 border-t">
                      <button
                        type="button"
                        onClick={() => setShowPaymentForm(false)}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Back to Review
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
