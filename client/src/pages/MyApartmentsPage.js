import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const MyApartmentsPage = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    axios
      .get('/api/v1/apartments/myapartments')
      .then(({ data }) => setApartments(data.data))
      .catch(() => setError('Failed to load your apartments.'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this apartment? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await axios.delete(`/api/v1/apartments/${id}`);
      setApartments((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete apartment.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>My Apartments</h1>
        <Link to="/create-apartment" className="btn btn-primary">
          + New Apartment
        </Link>
      </div>

      {error && <Alert type="danger" message={error} />}

      {apartments.length === 0 ? (
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
              {apartments.map((apt) => (
                <tr key={apt._id}>
                  <td>
                    <Link to={`/apartments/${apt._id}`}>{apt.location}</Link>
                  </td>
                  <td>${apt.pricePerNight}</td>
                  <td>{apt.maxGuests}</td>
                  <td>
                    <span className={`badge bg-${apt.status === 'Available' ? 'success' : 'secondary'}`}>
                      {apt.status}
                    </span>
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
