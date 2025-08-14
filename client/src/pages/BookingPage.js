import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookingPage = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchApartment = async () => {
      const { data } = await axios.get(`/api/v1/apartments/${id}`);
      setApartment(data.data);
    };

    fetchApartment();
  }, [id]);

  useEffect(() => {
    if (checkInDate && checkOutDate && apartment) {
      const oneDay = 24 * 60 * 60 * 1000;
      const firstDate = new Date(checkInDate);
      const secondDate = new Date(checkOutDate);
      const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
      setTotalPrice(diffDays * apartment.pricePerNight);
    }
  }, [checkInDate, checkOutDate, apartment]);

  const onSubmit = async (e) => {
    e.preventDefault();
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
      const body = JSON.stringify(newBooking);
      const res = await axios.post('/api/v1/bookings', body, config);
      alert('Booking successful!');
      // Redirect to my bookings page or somewhere else
    } catch (err) {
      console.error(err.response.data);
      alert('Booking failed');
    }
  };

  if (!apartment) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Book {apartment.location}</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Check-in Date</label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Check-out Date</label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            required
          />
        </div>
        {totalPrice > 0 && <h2>Total Price: ${totalPrice}</h2>}
        <button type="submit">Confirm & Pay</button>
      </form>
    </div>
  );
};

export default BookingPage;
