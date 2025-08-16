import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const ReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
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
    } catch (error) {
      console.error('Error fetching reviews', error);
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

  return (
    <div>
      <h1>Manage Reviews</h1>
      <table>
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
                    <button onClick={() => handleUpdateStatus(review._id, 'Approved')}>Approve</button>
                    <button onClick={() => handleUpdateStatus(review._id, 'Rejected')}>Reject</button>
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
