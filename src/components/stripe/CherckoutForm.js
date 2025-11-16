// components/CheckoutForm.js
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import './CheckoutForm.css';
import { removeUserCart } from '@/store/features/userSlice';
import { useDispatch } from 'react-redux';
import Loader from '../shared/loader';

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
const processDonation = async (paymentIntentId) => {
  donationData.payment_intent_id = paymentIntentId;
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
    // Show charity-themed success popup
    await Swal.fire({
      html: `
        <div class="charity-popup-content">
          <div class="charity-popup-header">
            <div class="charity-popup-icon">
              <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h2 class="charity-popup-title">
              Thank You for Your Generosity! 🙏
            </h2>
            <p class="charity-popup-description">
              Your donation of <strong class="charity-popup-amount">$${totalAmount}</strong> has been processed successfully
            </p>
          </div>
          
          <div class="charity-popup-impact">
            <div class="charity-popup-impact-header">
              <span class="charity-popup-sparkle">✨</span>
              <span class="charity-popup-impact-title">Your Impact</span>
            </div>
            <p class="charity-popup-impact-text">
              Your generous contribution will help make a real difference in people's lives. Every donation, no matter the size, brings hope and positive change to those who need it most.
            </p>
          </div>
          
          <div class="charity-popup-footer">
            <p class="charity-popup-footer-text">
              📧 A receipt has been sent to your email address<br>
              🏠 You'll be redirected to the homepage shortly
            </p>
          </div>
        </div>
      `,
      showConfirmButton: true,
      confirmButtonText: '🏠 Return Home',
      confirmButtonColor: 'var(--primary)',
      width: '500px',
      backdrop: 'rgba(0,0,0,0.4)',
      customClass: {
        popup: 'charity-success-popup',
        confirmButton: 'charity-success-button'
      },
      showClass: {
        popup: 'animate__animated animate__zoomIn animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut animate__faster'
      }
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
      {isProcessing && <Loader title="Processing Payment"/>}
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
