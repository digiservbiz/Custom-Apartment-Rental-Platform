import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';

const ReviewModerationPage = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: adminUser } = useContext(AuthContext);

  const handleUpdateReviewStatus = async (reviewId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`/api/v1/reviews/${reviewId}`, { status }, config);

      // Remove the review from the list for instant UI feedback
      setPendingReviews(pendingReviews.filter(review => review._id !== reviewId));
    } catch (err) {
      setError('Failed to update review status.');
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get('/api/v1/reviews', config);

        // Filter for pending reviews
        const filteredReviews = data.data.filter(review => review.status === 'Pending');

        setPendingReviews(filteredReviews);
        setLoading(false);
      } catch (err) {
        setError('Error fetching reviews for moderation');
        setLoading(false);
      }
    };

    if (adminUser) {
      fetchReviews();
    }
  }, [adminUser]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h1>Review Moderation</h1>
      {error && <Alert type="danger" message={error} />}
      {pendingReviews.length === 0 ? (
        <p>No pending reviews to moderate.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Apartment</th>
              <th>Renter</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingReviews.map((review) => (
              <tr key={review._id}>
                <td>{review.apartment.location}</td>
                <td>{review.renter.name}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleUpdateReviewStatus(review._id, 'Approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => handleUpdateReviewStatus(review._id, 'Rejected')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReviewModerationPage;
