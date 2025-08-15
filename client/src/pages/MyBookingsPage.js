import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get('/api/v1/bookings/mybookings', config);
        setBookings(data.data);
      } catch (error) {
        console.error('Error fetching my bookings', error);
      }
    };

    fetchMyBookings();
  }, []);

  return (
    <div>
      <h1>My Bookings</h1>
      {bookings.length === 0 ? (
        <p>You have no bookings.</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px' }}>
            <h3>Apartment: {booking.apartment.location}</h3>
            <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
            <p>Total Price: ${booking.totalPrice}</p>
            <p>Status: {booking.status}</p>
            {booking.status === 'Confirmed' && (
              <Link to={`/review/${booking.apartment._id}`}>
                <button>Leave a Review</button>
              </Link>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookingsPage;
