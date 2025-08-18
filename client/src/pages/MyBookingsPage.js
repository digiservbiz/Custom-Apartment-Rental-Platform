import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useTranslation } from 'react-i18next';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();

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
        setLoading(false);
      } catch (err) {
        setError('Error fetching my bookings');
        setLoading(false);
      }
    };

    if (user) {
        fetchMyBookings();
    } else {
        setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert type="danger" message={error} />;
  }

  return (
    <div>
      <h1>{t('my_bookings')}</h1>
      {bookings.length === 0 ? (
        <p>{t('you_have_no_bookings')}</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">{t('apartments')}: {booking.apartment.location}</h5>
                <p className="card-text">{t('check_in_date')}: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                <p className="card-text">{t('check_out_date')}: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                <p className="card-text">{t('total_price')}: ${booking.totalPrice}</p>
                <p className="card-text">{t('status')}: {booking.status}</p>
                {booking.status === 'Confirmed' && (
                <Link to={`/review/${booking.apartment._id}`} className="btn btn-primary">
                    {t('leave_a_review')}
                </Link>
                )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookingsPage;
