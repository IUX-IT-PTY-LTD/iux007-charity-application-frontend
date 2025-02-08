"use client";
import EventCard from "@/components/homepage-components/event-card";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaDonate, FaHandHoldingHeart, FaTrashAlt } from "react-icons/fa";
import { MdOutlineEmojiPeople } from "react-icons/md";

const Checkout = () => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [customDonationAmount, setCustomDonationAmount] = React.useState(0);
  const items = [
    {
      id: 1,
      title: "Event Name",
      code: "EVN-001",
      image: "/assets/img/event-img.jpg",
      price: 1000,
      quantity: 1,
    },
    {
      id: 2,
      title: "Event Name",
      code: "EVN-001",
      image: "/assets/img/event-img.jpg",
      price: 1000,
      quantity: 1,
    },
  ];

  const moreItems = [
    {
      id: 1,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 2,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 3,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 4,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 5,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 6,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 7,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 8,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 9,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 10,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },

    {
      id: 11,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 12,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 13,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 14,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },
    {
      id: 15,
      title: "Event Name",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      date: "2024-12-12",
      venue: "Lagos",
      image: "/assets/img/event-img.jpg",
      target: 1000000,
      raised: 500000,
    },

  ];

  const paymentMethods = [
    {
      id: 1,
      img: "/assets/img/4logos.png",
    },
    {
      id: 2,
      img: "/assets/img/payment-card-gpay-apple.png",
    },
    {
      id: 3,
      img: "/assets/img/paypal.png",
    },
    {
      id: 4,
      img: "/assets/img/crypto.png",
    },
  ];

  //   payment methods
  const [paymentMethod, setPaymentMethod] = React.useState(paymentMethods[0]);
  const [cartItems, setCartItems] = React.useState(items);
  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto relative bg-white rounded-lg py-6">
        {/* step 1 */}
        <div className="card border p-10">
          <div className="flex justify-between items-center gap-3 relative">
            <div
              className={`step-line ${currentStep === 1
                ? "step-1"
                : currentStep === 2
                  ? "step-2"
                  : "step-3"
                }`}
            ></div>
            <div className="step text-center">
              <div
                className={`icon-holder w-[60px] h-[60px] flex justify-center items-center mx-auto border mb-1 relative z-20 rounded-full ${currentStep >= 1
                  ? "bg-primary border-primary text-white"
                  : "text-gray-400 bg-white border-gray-400"
                  }`}
              >
                <FaHandHoldingHeart className="text-3xl" />
              </div>
              <span
                className={`${currentStep >= 1 ? "text-primary" : "text-gray-400"
                  }`}
              >
                Donation
              </span>
            </div>
            <div className="step text-center">
              <div
                className={`icon-holder w-[60px] h-[60px] flex justify-center items-center mx-auto border mb-1 relative z-20 rounded-full ${currentStep >= 2
                  ? "bg-primary border-primary text-white"
                  : "text-gray-400 bg-white border-gray-400"
                  }`}
              >
                <MdOutlineEmojiPeople className="text-3xl" />
              </div>
              <span
                className={`${currentStep >= 2 ? "text-primary" : "text-gray-400"
                  }`}
              >
                Donor
              </span>
            </div>
            <div className="step text-center">
              <div
                className={`icon-holder w-[60px] h-[60px] flex justify-center items-center relative z-20 mx-auto border mb-1 rounded-full ${currentStep >= 3
                  ? "bg-primary border-primary text-white"
                  : "text-gray-400 bg-white border-gray-400"
                  }`}
              >
                <FaDonate className="text-3xl" />
              </div>
              <span
                className={`${currentStep >= 3 ? "text-primary" : "text-gray-400"
                  }`}
              >
                Payment
              </span>
            </div>
          </div>

          {/* step 1 */}
          {currentStep === 1 && (
            <>
              <div className="my-6 flex justify-between items-center gap-3">
                <Link href={"/donations"} className="btn btn-primary bg-primary text-white px-5 py-2 rounded-md">
                  Add More Items
                </Link>

                {/* currency */}
                <div className="flex justify-between items-center gap-3">
                  <span className="text-gray-600">Currency</span>
                  <select
                    name="currency"
                    id="currency"
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="usd">USD</option>
                    <option value="cad">CAD</option>
                    <option value="gbp">GBP</option>
                  </select>
                </div>
              </div>

              <hr />

              <div className="items mt-6">
                {
                  cartItems.length > 0 ?
                    <>
                      {cartItems.map((item) => (
                        <div key={item.id}>
                          <div className="flex justify-between items-center gap-3 mt-3">
                            <div className="flex gap-3 items-center">
                              <div className="overflow-hidden w-16 h-16 rounded-lg">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  width={100}
                                  height={100}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {item.title}
                                </h3>
                                <p className="text-gray-600">Code: {item.code}</p>
                              </div>
                              <div className="flex gap-3 items-center ms-5">
                                <button
                                  className="btn btn-primary bg-primary text-white px-3 py-1 rounded-md"
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      setCartItems((prevItems) => {
                                        return prevItems.map((prevItem) => {
                                          if (prevItem.id === item.id) {
                                            return {
                                              ...prevItem,
                                              quantity: prevItem.quantity - 1,
                                            };
                                          }
                                          return prevItem;
                                        });
                                      });
                                    }
                                  }}
                                >
                                  -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  className="btn btn-primary bg-primary text-white px-3 py-1 rounded-md"
                                  onClick={() => {
                                    setCartItems((prevItems) => {
                                      return prevItems.map((prevItem) => {
                                        if (prevItem.id === item.id) {
                                          return {
                                            ...prevItem,
                                            quantity: prevItem.quantity + 1,
                                          };
                                        }
                                        return prevItem;
                                      });
                                    });
                                  }}
                                >
                                  +
                                </button>
                              </div>

                              {/* manual inputs for donation */}
                              <div>
                                <input
                                  type="text"
                                  className="border border-gray-300 rounded-md px-3 py-2"
                                  placeholder="Enter Amount"
                                  onChange={(e) => {
                                    // update the current item
                                    setCartItems((prevItems) => {
                                      return prevItems.map((prevItem) => {
                                        if (prevItem.id === item.id) {
                                          return {
                                            ...prevItem,
                                            price:
                                              e.target.value === "0" ||
                                                e.target.value === ""
                                                ? item.price
                                                : parseFloat(e.target.value),
                                          };
                                        }
                                        return prevItem;
                                      });
                                    });
                                  }}
                                />
                              </div>
                            </div>

                            {/* add quantity increase and decrease and the price will be change accordingly */}

                            <div className="flex justify-end items-center gap-3">
                              <span className="text-gray-600">Price</span>
                              <h3 className="text-lg font-semibold text-gray-800">
                                ${item.price * item.quantity}
                              </h3>
                              {/* delete from cart */}
                              <button
                                className="btn btn-primary w-[40px] h-[40px] rounded-full bg-primary text-white px-3 py-1"
                                onClick={() => {
                                  setCartItems((prevItems) => {
                                    return prevItems.filter(
                                      (prevItem) => prevItem.id !== item.id
                                    );
                                  });
                                }}
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          </div>

                          {/* divider if not the last item */}
                          {cartItems[cartItems.length - 1].id !== item.id && (
                            <hr className="my-6" />
                          )}
                        </div>
                      ))}
                    </> : <p className="text-xl font-bold text-primary text-center py-12">No Items Found in Cart</p>
                }
              </div>

              <hr className="my-6" />

              {/* more items */}
              <h2>
                <span className="text-2xl font-semibold text-gray-800 block my-6">
                  More Items
                </span>
              </h2>
              <div className="grid xl:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-4 z-50 relative max-md:mt-12 mb-12 card-p-0">
                {moreItems.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    description={event.description}
                    img={event.image}
                    time={event.date}
                    venue={event.venue}
                    target={event.target}
                    raised={event.raised}
                    showDetails={false}
                    buttonText="Add"
                    onClick={(e) => {
                      e.preventDefault();
                      setCartItems((prevItems) => {
                        return [
                          ...prevItems,
                          {
                            id: prevItems.length + 1,
                            title: event.title,
                            code: "EVN-001",
                            image: event.image,
                            price: 1000,
                            quantity: 1,
                          },
                        ];
                      });
                    }}
                  />
                ))}
              </div>

              {/* want to contribute admin? */}
              <hr />

              <div className="grid lg:grid-cols-2 grid-cols-1 my-6">
                <div className="item lg:border-r lg:pr-10">
                  <h2 className="text-2xl font-semibold text-gray-800 block">
                    Want to Contribute to Admin?
                  </h2>

                  {/* badge alert to show this is a one time contribution */}
                  <div className="bg-primary text-white text-xs px-3 py-1 rounded-md inline-block mt-3">
                    One Time Contribution Only
                  </div>

                  {/* custom donation amount options as buttons, once added, the amount should be added to the input field */}
                  <div className="flex flex-wrap gap-2 mt-6">
                    <button className="bg-primary text-white px-3 text-sm py-1 rounded" onClick={() => setCustomDonationAmount(50)}>
                      $50
                    </button>
                    <button className="bg-primary text-white px-3 text-sm py-1 rounded" onClick={() => setCustomDonationAmount(100)}>
                      $100
                    </button>
                    <button className="bg-primary text-white px-3 text-sm py-1 rounded" onClick={() => setCustomDonationAmount(200)}>
                      $200
                    </button>
                    <input
                      defaultValue={customDonationAmount}
                      type="number"
                      placeholder="Enter amount"
                      className="bg-gray-100 text-gray-800 px-3 py-2 text-sm w-full rounded"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-3 mt-6">
                    <button className="btn btn-primary bg-primary text-white px-5 py-2 rounded-md">
                      Contribute
                    </button>
                  </div>
                </div>

                {/* checkout */}
                <div className="item lg:pl-10 mt-6 lg:mt-0">
                  <h2 className="text-2xl font-semibold text-gray-800 block">
                    Checkout
                  </h2>

                  <div className="flex justify-between items-center gap-3 mt-6">
                    <div>
                      <span className="text-gray-600">Subtotal</span>
                      <h3 className="text-lg font-semibold text-gray-800">
                        $
                        {cartItems.reduce(
                          (acc, item) => acc + item.price * item.quantity,
                          0
                        )}
                      </h3>
                    </div>
                    <button
                      className="btn btn-primary bg-primary text-white px-5 py-2 rounded-md"
                      onClick={() => {
                        setCurrentStep(2);
                      }}
                    >
                      Proceed to Doner Details
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* step 2 */}
          {currentStep === 2 && (
            <>
              <form action="" className="mt-10">
                <div className="grid lg:grid-cols-3 md:cols-2 grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="text-gray-600">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      name="name"
                      id="name"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-gray-600">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="Enter Email"
                      name="email"
                      id="email"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-gray-600">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter Phone"
                      name="phone"
                      id="phone"
                      className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    />
                  </div>

                  {/* take permission to create an account */}
                  <div className="lg:col-span-3 md:col-span-2 col-span-1">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" name="create-account" id="create-account" />
                      <label htmlFor="create-account" className="text-gray-600">
                        Create an account?
                      </label>
                    </div>
                  </div>


                  <hr className="lg:col-span-3 md:col-span-2 col-span-1" />

                  {/* already have account? login */}
                  <div className="lg:col-span-3 md:col-span-2 col-span-1">
                    <h2 className="text-2xl font-semibold text-gray-800 block">
                      Already have an account?
                    </h2>
                    <p className="text-gray-600">
                      Login to your account to proceed with the donation.
                    </p>

                    <button className="btn btn-primary bg-primary text-white px-5 py-2 rounded-md mt-6">
                      Login
                    </button>
                  </div>
                  <hr className="lg:col-span-3 md:col-span-2 col-span-1" />

                  <div className="lg:col-span-3 flex justify-between items-center">
                    {/* back button */}
                    <button
                      type="button"
                      className="btn btn-primary bg-secondary text-white px-5 py-2 rounded-md"
                      onClick={() => {
                        setCurrentStep(1);
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary bg-primary text-white px-5 py-2 rounded-md"
                      onClick={() => {
                        setCurrentStep(3);
                      }}
                    >
                      Proceed to Payment
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}

          {/* step 3 */}
          {currentStep === 3 && (
            <>
              <form action="">
                <div className="grid mt-6 lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`payment-method cursor-pointer rounded border p-10 ${paymentMethod.id === method.id ? "active bg-light" : ""
                        }`}
                      onClick={() => {
                        setPaymentMethod(method);
                      }}
                    >
                      <Image
                        src={method.img}
                        alt="Payment Method"
                        width={100}
                        height={50}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center gap-3 mt-10">
                  <button
                    type="button"
                    className="btn btn-primary bg-secondary text-white px-5 py-2 rounded-md"
                    onClick={() => {
                      setCurrentStep(2);
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary bg-primary text-white px-5 py-2 rounded-md"
                  >
                    Pay Now
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
