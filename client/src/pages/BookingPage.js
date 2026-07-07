import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useTranslation } from 'react-i18next';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const BookingPage = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    axios
      .get(`/api/v1/apartments/${id}`)
      .then(({ data }) => setApartment(data.data))
      .catch(() => setError('Error fetching apartment details'))
      .finally(() => setLoading(false));
  }, [id]);

  // Estimate price locally for display only
  const estimatedNights =
    checkInDate && checkOutDate
      ? Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24))
      : 0;
  const estimatedPrice =
    estimatedNights > 0 && apartment ? estimatedNights * apartment.pricePerNight : 0;

  const today = new Date().toISOString().split('T')[0];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate) {
      return setError('Please select check-in and check-out dates');
    }
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      return setError('Check-out date must be after check-in date');
    }
    setSubmitting(true);
    setError('');
    try {
      const { data: bookingData } = await axios.post('/api/v1/bookings', {
        apartment: id,
        checkInDate,
        checkOutDate,
      });
      setBooking(bookingData.data);

      const { data: paymentData } = await axios.post('/api/v1/payments/create-payment-intent', {
        bookingId: bookingData.data._id,
      });
      setClientSecret(paymentData.clientSecret);
    } catch (err) {
      setError(err.response?.data?.error || t('booking_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!apartment) return <Alert type="danger" message={error || 'Apartment not found'} />;

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1>{t('book_apartment')}: {apartment.location}</h1>
      <p className="text-muted">${apartment.pricePerNight} / night</p>

      {error && <Alert type="danger" message={error} />}

      {!clientSecret ? (
        <form onSubmit={handleBookingSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="checkIn">{t('check_in_date')}</label>
            <input
              type="date"
              id="checkIn"
              value={checkInDate}
              min={today}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="checkOut">{t('check_out_date')}</label>
            <input
              type="date"
              id="checkOut"
              value={checkOutDate}
              min={checkInDate || today}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="form-control"
              required
            />
          </div>

          {estimatedNights > 0 && (
            <div className="alert alert-info">
              <strong>Estimated total:</strong> ${estimatedPrice.toFixed(2)}
              <small className="d-block text-muted">
                ({estimatedNights} night{estimatedNights > 1 ? 's' : ''} × ${apartment.pricePerNight} + platform commission)
              </small>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
            {submitting ? 'Creating booking…' : t('confirm_and_pay')}
          </button>
        </form>
      ) : (
        <div>
          <Alert type="success" message="Booking created! Complete your payment below." />
          {booking && (
            <p>
              <strong>Total charged:</strong> ${booking.totalPrice}
            </p>
          )}
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
