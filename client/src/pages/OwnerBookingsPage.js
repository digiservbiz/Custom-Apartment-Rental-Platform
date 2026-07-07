import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import StatusBadge from '../components/StatusBadge';

const OwnerBookingsPage = () => {
  const { user } = useContext(AuthContext);
  const { data: bookings, loading, error } = useFetch(
    user ? '/api/v1/bookings/owner-bookings' : null,
    { errorMessage: 'Failed to load bookings.' }
  );

  if (loading) return <Spinner />;
  if (error) return <Alert type="danger" message={error} />;

  const list = bookings || [];

  return (
    <div>
      <h1>Bookings on My Apartments</h1>
      {list.length === 0 ? (
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
              {list.map((b) => (
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
                  <td>
                    <StatusBadge status={b.status} />
                  </td>
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
