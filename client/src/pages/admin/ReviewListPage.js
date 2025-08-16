import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';

const ReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: adminUser } = useContext(AuthContext);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/v1/reviews', config);
      setReviews(data.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching reviews');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser && adminUser.role === 'admin') {
      fetchReviews();
    }
  }, [adminUser]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`/api/v1/reviews/${id}`, { status }, config);
      fetchReviews(); // Refresh the list
    } catch (error) {
      console.error('Error updating review status', error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert type="danger" message={error} />;
  }

  return (
    <div>
      <h1>Manage Reviews</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Apartment</th>
            <th>Renter</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id}>
              <td>{review.apartment.location}</td>
              <td>{review.renter.name}</td>
              <td>{review.rating}</td>
              <td>{review.comment}</td>
              <td>{review.status}</td>
              <td>
                {review.status === 'Pending' && (
                  <>
                    <button onClick={() => handleUpdateStatus(review._id, 'Approved')} className="btn btn-success btn-sm">Approve</button>
                    <button onClick={() => handleUpdateStatus(review._id, 'Rejected')} className="btn btn-danger btn-sm ms-2">Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewListPage;
