import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const statusBadge = (status) => {
  const map = { Confirmed: 'success', Pending: 'warning', Cancelled: 'secondary' };
  return <span className={`badge bg-${map[status] || 'info'}`}>{status}</span>;
};

const OwnerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) return;
    axios
      .get('/api/v1/bookings/owner-bookings')
      .then(({ data }) => setBookings(data.data))
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Spinner />;
  if (error) return <Alert type="danger" message={error} />;

  return (
    <div>
      <h1>Bookings on My Apartments</h1>
      {bookings.length === 0 ? (
        <p className="text-muted">No bookings on your apartments yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Apartment</th>
                <th>Renter</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.apartment?.location}</td>
                  <td>
                    {b.renter?.name}
                    <br />
                    <small className="text-muted">{b.renter?.email}</small>
                  </td>
                  <td>{new Date(b.checkInDate).toLocaleDateString()}</td>
                  <td>{new Date(b.checkOutDate).toLocaleDateString()}</td>
                  <td>${b.totalPrice}</td>
                  <td>{statusBadge(b.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OwnerBookingsPage;
