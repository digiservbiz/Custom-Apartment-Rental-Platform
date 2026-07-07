import React, { useState, useContext } from 'react';
import axios from '../../api/axios';
import AuthContext from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';

const ReviewModerationPage = () => {
  const { user: adminUser } = useContext(AuthContext);
  const {
    data: reviews,
    loading,
    error: fetchError,
    setData: setReviews,
  } = useFetch(adminUser ? '/api/v1/reviews' : null, {
    errorMessage: 'Error fetching reviews for moderation',
  });
  const [updateError, setUpdateError] = useState('');

  const pendingReviews = (reviews || []).filter((review) => review.status === 'Pending');

  const handleUpdateReviewStatus = async (reviewId, status) => {
    try {
      await axios.put(`/api/v1/reviews/${reviewId}`, { status });
      // Remove the review from the list for instant UI feedback
      setReviews((prev) => prev.filter((review) => review._id !== reviewId));
    } catch (err) {
      setUpdateError('Failed to update review status.');
    }
  };

  if (loading) return <Spinner />;

  const error = fetchError || updateError;

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
                <td>{review.apartment?.location}</td>
                <td>{review.renter?.name}</td>
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
