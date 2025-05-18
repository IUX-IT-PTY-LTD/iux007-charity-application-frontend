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

const Checkout = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [adminContributionAmount, setAdminContributionAmount] = React.useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const userInfo = useSelector((state) => state.user.user);
  console.log(userInfo);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  /** Stripe Integration */
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    // Get cart items from localStorage when component mounts
    const cart = localStorage.getItem('cartItems');
    if (cart) {
      const parsedCart = JSON.parse(cart);
      setCartItems(parsedCart);
      setTotalAmount(
        parsedCart.reduce((acc, item) => acc + item.price * item.quantity, 0) +
          adminContributionAmount
      );
    }
  }, []);

  // Add this function at the component level:
  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prev) => {
      const updatedCart = prev.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
      );
      // Update localStorage with new cart data
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      setTotalAmount(
        updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0) +
          adminContributionAmount
      );
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
      setTotalAmount(
        updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0) +
          adminContributionAmount
      );
      return updatedCart;
    });
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
                      <div key={item.id} className="py-6 flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className="w-24 h-24 rounded-lg overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                              loader={({ src }) => src}
                            />
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>

                            <div className="mt-4 flex items-center space-x-4">
                              <div className="flex items-center border rounded-lg">
                                <button
                                  onClick={() =>
                                    item.quantity > 1 ? handleDecreaseQuantity(item.id) : null
                                  }
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  -
                                </button>
                                <span className="px-4 py-1 border-x">{item.quantity}</span>
                                <button
                                  onClick={() => handleIncreaseQuantity(item.id)}
                                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>

                              <input
                                type="number"
                                placeholder="Amount"
                                className="w-32 px-2 py-1.5 rounded border border-gray-200 focus:border-primary text-sm transition-all"
                                disabled={item.isFixedDonation ? true : false}
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
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Price</div>
                            <div className="text-lg font-semibold">
                              ${item.price * item.quantity}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setCartItems((prev) => prev.filter((i) => i.id !== item.id));
                              // Update localStorage after removing item
                              const updatedCart = cartItems.filter((i) => i.id !== item.id);
                              localStorage.setItem('cartItems', JSON.stringify(updatedCart));
                              setTotalAmount(
                                updatedCart.reduce(
                                  (acc, item) => acc + item.price * item.quantity,
                                  0
                                )
                              );
                              // Update totalAmount state with the updated total amount
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <FaTrashAlt />
                          </button>
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
                      <div className="flex flex-wrap gap-2">
                        {[50, 100, 200].map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setAdminContributionAmount(amount)}
                            className={`px-4 py-2 text-sm font-medium ${
                              adminContributionAmount === amount
                                ? 'bg-primary text-white'
                                : 'text-primary border border-primary'
                            } rounded-lg hover:bg-primary hover:text-white transition-colors`}
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>

                      <input
                        type="number"
                        value={adminContributionAmount}
                        onChange={(e) => setAdminContributionAmount(Number(e.target.value))}
                        min="0"
                        placeholder="Enter custom amount"
                        className="w-32 px-2 py-1.5 rounded border border-gray-200 focus:border-primary text-sm transition-all"
                      />

                      <button className="w-full px-6 py-3 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                        Contribute
                      </button>
                    </div>
                  </div>

                  <div className="lg:border-l lg:pl-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900">Order Summary</h3>

                      <div className="space-y-4">
                        {/* Calculate total amount and store in variable for reuse */}

                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">${totalAmount}</span>
                        </div>

                        <button
                          onClick={() => setCurrentStep(2)}
                          className="w-full px-6 py-3 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
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
              <form className="max-w-3xl mx-auto space-y-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      label: 'Full Name',
                      type: 'text',
                      placeholder: 'Enter your full name',
                      value: userInfo?.name || '',
                      key: 'name',
                    },
                    {
                      label: 'Email',
                      type: 'email',
                      placeholder: 'Enter your email',
                      value: userInfo?.email || '',
                      key: 'email',
                    },
                    {
                      label: 'Phone',
                      type: 'tel',
                      placeholder: 'Enter your phone number',
                      value: userInfo?.phone || '',
                      key: 'phone',
                    },
                  ].map((field, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => {
                          const updatedUserInfo = {
                            ...userInfo,
                            [field.key]: e.target.value,
                          };
                        }}
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition duration-200 text-gray-700 text-base outline-none"
                      />
                    </div>
                  ))}
                </div>

                {/* <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="create-account"
                    className="form-checkbox rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor="create-account" className="ml-2 text-gray-700">
                    Create an account for faster checkout
                  </label>
                </div> */}

                {!isAuthenticated && (
                  <div className="border-t pt-8">
                    <div className="text-center space-y-4">
                      <h3 className="text-xl font-semibold">Already have an account?</h3>
                      <p className="text-gray-600">Sign in for a faster checkout experience</p>
                      <button className="px-6 py-3 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                        Sign In
                      </button>
                    </div>
                  </div>
                )}

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
              </form>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="grid">
                  <Elements stripe={stripePromise}>
                    <CheckoutForm totalAmount={totalAmount} />
                  </Elements>
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
                  <button
                    type="submit"
                    className="px-8 py-3 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Complete Payment
                  </button>
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
