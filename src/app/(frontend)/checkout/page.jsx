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
import CheckoutForm from '@/components/stripe/CherckoutForm';
import { setUserCart } from '@/store/features/userSlice';
import { useRouter } from 'next/navigation';

const Checkout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [adminContributionAmount, setAdminContributionAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [checkoutData, setCheckoutData] = useState(null);
  const userInfo = useSelector((state) => state.user.user);
  console.log(userInfo);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  /** Stripe Integration */
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

  useEffect(() => {
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
  }, []);

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
      id: 1,
      img: '/assets/img/4logos.png',
    },
    {
      id: 2,
      img: '/assets/img/payment-card-gpay-apple.png',
    },
  ];

  //   payment methods
  const [paymentMethod, setPaymentMethod] = React.useState(paymentMethods[0]);
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-8">
            {/* Progress Steps */}
            <div className="relative flex justify-between items-center mb-12">
              <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-gray-200">
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
                <div key={index} className="relative z-10 text-center">
                  <div
                    className={`w-16 h-16 mx-auto flex items-center justify-center rounded-full border-2 transition-all ${
                      currentStep > index
                        ? 'bg-primary border-primary text-white'
                        : currentStep === index
                          ? 'bg-primary border-primary text-white animate-pulse'
                          : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    <div className="text-2xl">{step.icon}</div>
                  </div>
                  <div
                    className={`mt-3 font-medium ${
                      currentStep >= index + 1 ? 'text-primary' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Step 1: Cart */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <Link
                    href="/events"
                    className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <span className="mr-2">Add More Items</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="bg-white rounded-xl shadow-md overflow-hidden mb-6 hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            {/* Image and Details Section */}
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  width={192}
                                  height={192}
                                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                                  loader={({ src }) => src}
                                />
                              </div>

                              <div className="flex-grow space-y-4">
                                <h3 className="text-xl font-bold text-gray-900 hover:text-primary transition-colors">
                                  {item.title}
                                </h3>

                                {/* Quantity Controls */}
                                <div className="flex flex-wrap items-center gap-4">
                                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                    <button
                                      onClick={() =>
                                        item.quantity > 1 ? handleDecreaseQuantity(item.id) : null
                                      }
                                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                      disabled={item.quantity <= 1}
                                    >
                                      -
                                    </button>
                                    <span className="px-6 py-2 font-medium border-x border-gray-200 bg-white">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => handleIncreaseQuantity(item.id)}
                                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                      +
                                    </button>
                                  </div>

                                  <input
                                    type="number"
                                    placeholder="Amount"
                                    className="w-32 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
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
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all resize-none"
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
                            <div className="flex flex-col items-end gap-4">
                              <div className="text-right">
                                <div className="text-sm text-gray-500">Total Price</div>
                                <div className="text-2xl font-bold text-primary">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>

                              <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-all duration-300 group"
                              >
                                <FaTrashAlt className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
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

                <div className="grid lg:grid-cols-2 gap-8 pt-8 border-t">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Want to Contribute to Admin?
                      </h3>
                      <span className="inline-block mt-2 px-3 py-1 text-xs font-medium text-white bg-primary rounded-full">
                        One Time Contribution Only
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={adminContributionAmount.toFixed(2)}
                          onChange={(e) => {
                            const value = Math.max(0, Number(e.target.value));
                            setAdminContributionAmount(value);
                          }}
                          min="0"
                          placeholder="Admin contribution amount"
                          className="w-48 px-4 py-2 rounded-lg border border-gray-200 focus:border-primary text-sm transition-all"
                        />
                        <span className="text-sm text-gray-500">
                          (Suggested : ${adminContributionAmount.toFixed(2)})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:border-l lg:pl-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900">Order Summary</h3>

                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">${totalAmount}</span>
                        </div>

                        <button
                          onClick={() => setCurrentStep(2)}
                          className="w-full px-6 py-3 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
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
                        onClick={() => router.push('/login')}
                        className="px-6 py-3 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                      >
                        Sign In
                      </button>
                    </div>

                    <div className="flex justify-between pt-8 border-t">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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

                    <div className="flex justify-between pt-8 border-t">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Back to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="px-6 py-3 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
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
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="grid">
                  {!stripePublishableKey ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                      <h3 className="text-lg font-semibold text-red-800 mb-2">Payment Configuration Error</h3>
                      <p className="text-red-600 mb-4">
                        Stripe payment is not properly configured. Please contact support.
                      </p>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Go Back
                      </button>
                    </div>
                  ) : stripePromise ? (
                    <Elements stripe={stripePromise}>
                      <CheckoutForm totalAmount={totalAmount} donationData={checkoutData} />
                    </Elements>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Payment System...</h3>
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  )}
                  {/* {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method)}
                      className={`
                        p-6 border rounded-xl cursor-pointer transition-all
                        ${
                          paymentMethod.id === method.id
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'hover:border-gray-300'
                        }
                      `}
                    >
                      <Image
                        src={method.img}
                        alt="Payment Method"
                        width={100}
                        height={50}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  ))} */}
                </div>

                <div className="flex justify-between pt-8 border-t">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  {/* <button
                    type="submit"
                    className="px-8 py-3 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Complete Payment
                  </button> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
