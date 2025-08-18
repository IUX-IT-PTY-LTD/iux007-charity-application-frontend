'use client';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaTrash } from 'react-icons/fa';

// Dummy data for development
const dummyCartItems = [
  {
    id: 1,
    cause: 'Save the Children',
    amount: 50.0,
    image: 'https://placehold.co/100x100?text=Children',
    quantity: 1,
  },
  {
    id: 2,
    cause: 'Ocean Cleanup',
    amount: 25.0,
    image: 'https://placehold.co/100x100?text=Ocean',
    quantity: 2,
  },
  {
    id: 3,
    cause: 'Food Bank',
    amount: 35.0,
    image: 'https://placehold.co/100x100?text=Food',
    quantity: 1,
  },
];

const DonationCart = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState(dummyCartItems);

  if (!isOpen) return null;

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.amount * item.quantity, 0);
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  return (
    <div id="donation-cart" className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Your Donations</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Close cart"
            >
              <IoMdClose size={24} />
            </button>
          </div>
        </div>

        <div className="p-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500">Your donation cart is empty</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center mb-4 p-3 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.cause}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="font-semibold">{item.cause}</h3>
                    <p className="text-green-600">${item.amount.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        -
                      </button>
                      <span className="mx-3">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Total</h3>
                  <p className="text-xl font-bold text-green-600">${calculateTotal().toFixed(2)}</p>
                </div>

                <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationCart;
