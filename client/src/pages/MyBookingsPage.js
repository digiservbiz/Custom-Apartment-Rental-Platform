import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import StatusBadge from '../components/StatusBadge';

const MyBookingsPage = () => {
  const { user } = useContext(AuthContext);
  const { t } = useTranslation();
  const { data: bookings, loading, error } = useFetch(
    user ? '/api/v1/bookings/mybookings' : null,
    { errorMessage: 'Error fetching my bookings' }
  );

  if (loading) return <Spinner />;
  if (error) return <Alert type="danger" message={error} />;

  const list = bookings || [];

  return (
    <div>
      <h1>{t('my_bookings')}</h1>
      {list.length === 0 ? (
        <p>{t('you_have_no_bookings')}</p>
      ) : (
        list.map((booking) => (
          <div key={booking._id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{t('apartments')}: {booking.apartment.location}</h5>
              <p className="card-text">{t('check_in_date')}: {new Date(booking.checkInDate).toLocaleDateString()}</p>
              <p className="card-text">{t('check_out_date')}: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
              <p className="card-text">{t('total_price')}: ${booking.totalPrice}</p>
              <p className="card-text">
                {t('status')}: <StatusBadge status={booking.status} />
              </p>
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
