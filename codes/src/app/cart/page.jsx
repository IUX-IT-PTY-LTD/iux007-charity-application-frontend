"use client";
import Image from "next/image";
import React from "react";

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      name: "Event Name",
      amount: 500,
      image: "/assets/img/event-img.jpg",
      quantity: 2,
      tax: 4,
    },
    {
      id: 2,
      name: "Event Name",
      amount: 100,
      image: "/assets/img/event-img.jpg",
      quantity: 2,
      tax: 4,
    },
    {
      id: 3,
      name: "Event Name",
      amount: 400,
      image: "/assets/img/event-img.jpg",
      quantity: 2,
      tax: 4,
    },
  ];

  const [currentCart, setCurrentCart] = React.useState(cartItems);
  return (
    <>
      <div className="cart-page py-16">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-gray-100 p-6 rounded-md">
                <h2 className="text-2xl font-extrabold text-gray-800">
                  Your Cart
                </h2>
                <div className="space-y-4 mt-8">
                  {currentCart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 shrink-0 bg-white p-2 rounded-md">
                          <Image
                            src={item.image}
                            className="w-full h-full object-contain"
                            width={100}
                            height={100}
                            alt={item.name}
                          />
                        </div>

                        <div className="w-full">
                          <h3 className="text-base font-semibold text-gray-800">
                            {item.name}
                          </h3>
                          <h6 className="text-sm text-gray-800 font-bold cursor-pointer mt-0.5">
                            ${item.amount * item.quantity}
                          </h6>

                          <div className="flex gap-4 mt-4">
                            <div>
                              <button
                                type="button"
                                className="flex items-center px-2.5 py-1.5 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
                              >
                                <svg
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      const newCart = currentCart.map(
                                        (cartItem) => {
                                          if (cartItem.id === item.id) {
                                            return {
                                              ...cartItem,
                                              quantity: cartItem.quantity - 1,
                                            };
                                          }
                                          return cartItem;
                                        }
                                      );
                                      setCurrentCart(newCart);
                                    }
                                  }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-2.5 fill-current"
                                  viewBox="0 0 124 124"
                                >
                                  <path
                                    d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                                    data-original="#000000"
                                  ></path>
                                </svg>

                                <span className="mx-2.5">{item.quantity}</span>
                                <svg
                                  onClick={() => {
                                    const newCart = currentCart.map(
                                      (cartItem) => {
                                        if (cartItem.id === item.id) {
                                          return {
                                            ...cartItem,
                                            quantity: cartItem.quantity + 1,
                                          };
                                        }
                                        return cartItem;
                                      }
                                    );
                                    setCurrentCart(newCart);
                                  }}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-2.5 fill-current"
                                  viewBox="0 0 42 42"
                                >
                                  <path
                                    d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                                    data-original="#000000"
                                  ></path>
                                </svg>
                              </button>
                            </div>

                            <div className="ml-auto">
                              <button
                                className="btn"
                                onClick={
                                  // delete item

                                  () => {
                                    console.log("delete item");
                                    const newCart = currentCart.filter(
                                      (cartItem) => cartItem.id !== item.id
                                    );
                                    setCurrentCart(newCart);
                                  }
                                }
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 fill-red-500 inline cursor-pointer"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                    data-original="#000000"
                                  ></path>
                                  <path
                                    d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                    data-original="#000000"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-4">
                <Image
                  src="/assets/img/master.webp"
                  alt="card1"
                  className="w-12 object-contain"
                  width={50}
                  height={50}
                />
                <Image
                  src="/assets/img/visa.webp"
                  alt="card2"
                  className="w-12 object-contain"
                  width={50}
                  height={50}
                />
                <Image
                  src="/assets/img/american-express.webp"
                  alt="card3"
                  className="w-12 object-contain"
                  width={50}
                  height={50}
                />
              </div>
            </div>

            <form>
              <h2 className="text-2xl font-extrabold text-gray-800">
                Payment Details
              </h2>
              <div className="grid gap-4 mt-8">
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="px-4 py-3 bg-transparent text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:border-purple-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-2">
                    Card Number
                  </label>
                  <div className="flex bg-transparent border border-gray-300 rounded-md focus-within:border-purple-500 overflow-hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 ml-3"
                      viewBox="0 0 32 20"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="10"
                        fill="#f93232"
                        data-original="#f93232"
                      />
                      <path
                        fill="#fed049"
                        d="M22 0c-2.246 0-4.312.75-5.98 2H16v.014c-.396.298-.76.634-1.107.986h2.214c.308.313.592.648.855 1H14.03a9.932 9.932 0 0 0-.667 1h5.264c.188.324.365.654.518 1h-6.291a9.833 9.833 0 0 0-.377 1h7.044c.104.326.186.661.258 1h-7.563c-.067.328-.123.66-.157 1h7.881c.039.328.06.661.06 1h-8c0 .339.027.67.06 1h7.882c-.038.339-.093.672-.162 1h-7.563c.069.341.158.673.261 1h7.044a9.833 9.833 0 0 1-.377 1h-6.291c.151.344.321.678.509 1h5.264a9.783 9.783 0 0 1-.669 1H14.03c.266.352.553.687.862 1h2.215a10.05 10.05 0 0 1-1.107.986A9.937 9.937 0 0 0 22 20c5.523 0 10-4.478 10-10S27.523 0 22 0z"
                        className="hovered-path"
                        data-original="#fed049"
                      />
                    </svg>
                    <input
                      type="number"
                      placeholder="xxxx xxxx xxxx"
                      className="px-4 py-3 bg-transparent text-gray-800 w-full text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="number"
                      placeholder="08/27"
                      className="px-4 py-3 bg-transparent text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:border-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-2">
                      CVV
                    </label>
                    <input
                      type="number"
                      placeholder="XXX"
                      className="px-4 py-3 bg-transparent text-gray-800 w-full text-sm border border-gray-300 rounded-md focus:border-purple-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <ul className="text-gray-800 mt-8 space-y-4">
                <li className="flex flex-wrap gap-4 text-sm">
                  Subtotal{" "}
                  <span className="ml-auto font-bold">
                    $
                    {currentCart.reduce(
                      (acc, item) => acc + item.amount * item.quantity,
                      0
                    )}
                  </span>
                </li>
                <li className="flex flex-wrap gap-4 text-sm">
                  Tax{" "}
                  <span className="ml-auto font-bold">
                    ${currentCart.reduce((acc, item) => acc + item.tax, 0)}
                  </span>
                </li>
                <hr className="border-gray-300" />
                <li className="flex flex-wrap gap-4 text-sm font-bold">
                  Total{" "}
                  <span className="ml-auto">
                    $
                    {currentCart.reduce(
                      (acc, item) =>
                        acc + item.amount * item.quantity + item.tax,
                      0
                    )}
                  </span>
                </li>
              </ul>

              <button
                type="button"
                className="mt-8 text-sm px-4 py-3 w-full font-semibold tracking-wide bg-purple-600 hover:bg-purple-700 text-white rounded-md"
              >
                Make Payment{" "}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
