// components/CheckoutForm.js
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { apiService } from '@/api/services/apiService';
import { ENDPOINTS } from '@/api/config';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import './CheckoutForm.css';
import { removeUserCart } from '@/store/features/userSlice';
import { useDispatch } from 'react-redux';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

export default function CheckoutForm({ totalAmount, donationData }) {
  console.log('donationData:', donationData);
  const router = useRouter();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsProcessing(true);

  try {
    const amount = validateAmount(totalAmount);
    const paymentIntent = await createPaymentIntent(amount);
    const donationResult = await processDonation(paymentIntent.payment_intent_id);
    
    if (donationResult.success) {
      await processStripePayment(paymentIntent.client_secret);
    }
  } catch (err) {
    handleError(err);
  } finally {
    setIsProcessing(false);
  }
};

// Validate payment amount
const validateAmount = (amount) => {
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) {
    throw new Error('Invalid amount');
  }
  return parsedAmount;
};

// Create Stripe payment intent
const createPaymentIntent = async (amount) => {
  const response = await apiService.post(ENDPOINTS.PAYMENTS.STRIPE_PAYMENT_INTENT, {
    total_amount: amount,
  });
  return response.data;
};

// Process donation
const processDonation = async (clientSecret) => {
  donationData.payment_intent_id = clientSecret;
  const response = await apiService.post(ENDPOINTS.DONATIONS.CREATE, donationData);
  
  if (response.status === 'success') {
    localStorage.removeItem('cartItems');
    dispatch(removeUserCart());
    return { success: true };
  }
  
  setMessage('An error occurred while processing your payment.');
  console.error('Payment error:', response);
  return { success: false };
};

// Process Stripe payment
const processStripePayment = async (clientSecret) => {
  const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement(CardElement),
    },
  });

  if (result.error) {
    setMessage(result.error.message);
    return;
  }

  if (result.paymentIntent.status === 'succeeded') {
    setMessage('Payment succeeded!');
    // Show success popup
    await Swal.fire({
      icon: 'success',
      title: 'Payment Successful!',
      text: 'Thank you for your donation. Your payment has been processed successfully.',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6'
    });
    router.push('/');
  }
};

// Handle errors
const handleError = (error) => {
  setMessage('An error occurred while processing your payment.');
  console.error('Payment error:', error);
};

  return (
    <div className="payment-form-container">
      <div className="payment-card">
        <div className="card-header">
          <h3>Enter Payment Details</h3>
          <div className="card-logos">
            <img src="/assets/img/visa.svg" alt="visa" />
            <img src="/assets/img/mastercard.svg" alt="visa" />
            <img src="/assets/img/american-express.svg" alt="visa" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>

          <button className="payment-button" type="submit" disabled={!stripe || isProcessing}>
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>

          {message && (
            <div
              className={`payment-message ${message.includes('succeeded') ? 'success' : 'error'}`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
