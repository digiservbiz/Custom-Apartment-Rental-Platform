import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import StatusBadge from '../components/StatusBadge';

const MyApartmentsPage = () => {
  const { user } = useContext(AuthContext);
  const {
    data: apartments,
    loading,
    error,
    setData: setApartments,
  } = useFetch(user ? '/api/v1/apartments/myapartments' : null, {
    errorMessage: 'Failed to load your apartments.',
  });
  const [deleteError, setDeleteError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this apartment? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/v1/apartments/${id}`);
      setApartments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setDeleteError(err.response?.data?.error || 'Failed to delete apartment.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Spinner />;

  const list = apartments || [];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>My Apartments</h1>
        <Link to="/create-apartment" className="btn btn-primary">
          + New Apartment
        </Link>
      </div>

      {(error || deleteError) && <Alert type="danger" message={error || deleteError} />}

      {list.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>You have no apartments listed yet.</p>
          <Link to="/create-apartment" className="btn btn-outline-primary">
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Location</th>
                <th>Price / night</th>
                <th>Max Guests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((apt) => (
                <tr key={apt._id}>
                  <td>
                    <Link to={`/apartments/${apt._id}`}>{apt.location}</Link>
                  </td>
                  <td>${apt.pricePerNight}</td>
                  <td>{apt.maxGuests}</td>
                  <td>
                    <StatusBadge status={apt.status} />
                  </td>
                  <td>
                    <Link to={`/apartments/${apt._id}/edit`} className="btn btn-sm btn-outline-primary me-2">
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(apt._id)}
                      disabled={deletingId === apt._id}
                    >
                      {deletingId === apt._id ? 'Deleting…' : 'Delete'}
                    </button>
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

export default MyApartmentsPage;
