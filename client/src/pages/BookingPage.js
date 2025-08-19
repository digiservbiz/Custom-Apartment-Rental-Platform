import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useTranslation } from 'react-i18next';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe promise outside of the component render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const BookingPage = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const { data } = await axios.get(`/api/v1/apartments/${id}`);
        setApartment(data.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching apartment details');
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id]);

  useEffect(() => {
    if (checkInDate && checkOutDate && apartment) {
      const oneDay = 24 * 60 * 60 * 1000;
      const firstDate = new Date(checkInDate);
      const secondDate = new Date(checkOutDate);
      const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
      if (diffDays > 0) {
        setTotalPrice(diffDays * apartment.pricePerNight);
      } else {
        setTotalPrice(0);
      }
    }
  }, [checkInDate, checkOutDate, apartment]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (totalPrice === 0) {
      setError('Check-out date must be after check-in date');
      return;
    }
    const newBooking = {
      apartment: id,
      checkInDate,
      checkOutDate,
      totalPrice,
    };
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };

      // 1. Create the booking to get a bookingId
      const { data: bookingData } = await axios.post('/api/v1/bookings', newBooking, config);

      // 2. Create a Payment Intent with the new bookingId
      const { data: paymentData } = await axios.post('/api/v1/payments/create-payment-intent', { bookingId: bookingData.data._id }, config);

      setClientSecret(paymentData.clientSecret);
      setSuccess('Booking created. Please complete your payment.');
      setError('');
    } catch (err) {
      setError(t('booking_failed'));
      setSuccess('');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      {apartment && <h1>{t('book_apartment')} {apartment.location}</h1>}
      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message={success} />}

      {!clientSecret ? (
        <form onSubmit={handleBookingSubmit}>
          <div className="form-group">
            <label>{t('check_in_date')}</label>
            <input
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>{t('check_out_date')}</label>
            <input
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="form-control"
              required
            />
          </div>
          {totalPrice > 0 && <h2>{t('total_price')}: ${totalPrice}</h2>}
          <button type="submit" className="btn btn-primary mt-3">{t('confirm_and_pay')}</button>
        </form>
      ) : (
        <div>
          <h2>Complete Your Payment</h2>
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
