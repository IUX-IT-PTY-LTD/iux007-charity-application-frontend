'use client';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { removeUserCart } from '@/store/features/userSlice';
import { useDispatch } from 'react-redux';
import Loader from '../shared/loader';
import './CustomPaymentForm.css';

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

export default function CustomPaymentForm({ totalAmount, donationData }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrors({});

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

  const validateAmount = (amount) => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      throw new Error('Invalid amount');
    }
    return parsedAmount;
  };

  const createPaymentIntent = async (amount) => {
    const response = await apiService.post(ENDPOINTS.PAYMENTS.STRIPE_PAYMENT_INTENT, {
      total_amount: amount,
    });
    return response.data;
  };

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

  const processStripePayment = async (clientSecret) => {
    const cardNumberElement = elements.getElement(CardNumberElement);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberElement,
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
            <img src="/assets/img/mastercard.svg" alt="mastercard" />
            <img src="/assets/img/american-express.svg" alt="american-express" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-section">
            <label className="form-label">Card Number</label>
            <div className="card-number-input">
              <CardNumberElement
                options={{
                  ...CARD_ELEMENT_OPTIONS,
                  style: {
                    ...CARD_ELEMENT_OPTIONS.style,
                    base: {
                      ...CARD_ELEMENT_OPTIONS.style.base,
                      fontSize: '18px',
                      fontFamily: 'monospace',
                      letterSpacing: '1px',
                    },
                  },
                }}
                className="card-number-element"
              />
              <div className="card-brand-icon">
                <svg width="32" height="20" viewBox="0 0 32 20" fill="currentColor">
                  <rect x="0" y="0" width="32" height="20" rx="3" fill="#f3f4f6"/>
                  <rect x="2" y="2" width="28" height="16" rx="2" fill="white"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label className="form-label">Expiry Date</label>
              <div className="card-input-small">
                <CardExpiryElement
                  options={{
                    ...CARD_ELEMENT_OPTIONS,
                    style: {
                      ...CARD_ELEMENT_OPTIONS.style,
                      base: {
                        ...CARD_ELEMENT_OPTIONS.style.base,
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.5px',
                      },
                    },
                  }}
                  className="card-element-small"
                />
              </div>
            </div>

            <div className="form-section">
              <label className="form-label">CVV</label>
              <div className="card-input-small">
                <CardCvcElement
                  options={{
                    ...CARD_ELEMENT_OPTIONS,
                    style: {
                      ...CARD_ELEMENT_OPTIONS.style,
                      base: {
                        ...CARD_ELEMENT_OPTIONS.style.base,
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        letterSpacing: '0.5px',
                      },
                    },
                  }}
                  className="card-element-small"
                />
                <div className="cvv-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          
          <div className="security-notice">
            <div className="security-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="security-text">
              Your payment information is encrypted and secure
            </span>
          </div>

          <button
            className="payment-button-enhanced"
            type="submit"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Pay ${totalAmount}
              </span>
            )}
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