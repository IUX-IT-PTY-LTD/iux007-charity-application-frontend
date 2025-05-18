// components/CheckoutForm.js
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { apiService } from '@/api/services/apiService';
import { ENDPOINTS } from '@/api/config';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import './CheckoutForm.css';
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

export default function CheckoutForm({ totalAmount }) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Ensure totalAmount is a valid number
      const amount = parseFloat(totalAmount);
      if (isNaN(amount)) {
        throw new Error('Invalid amount');
      }

      const res = await apiService.post(ENDPOINTS.PAYMENTS.STRIPE_PAYMENT_INTENT, {
        total_amount: amount, // Convert to cents for Stripe
      });

      const {
        data: { client_secret: clientSecret },
      } = res;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setMessage(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setMessage('Payment succeeded!');
          toast.success('Payment successful');
          router.push('/');
        }
      }
    } catch (err) {
      setMessage('An error occurred while processing your payment.');
      console.error('Payment error:', err);
    }

    setIsProcessing(false);
  };

  return (
    <div className="payment-form-container">
      <ToastContainer />
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
