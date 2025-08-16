import React, { useState } from 'react';
import axios from 'axios';
import Alert from './Alert';

const ReviewForm = ({ apartmentId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const newReview = {
      apartment: apartmentId,
      rating,
      comment,
    };
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };
      const body = JSON.stringify(newReview);
      await axios.post('/api/v1/reviews', body, config);
      setSuccess('Review submitted successfully! It will be visible after moderation.');
      setError('');
      setRating(5);
      setComment('');
    } catch (err) {
      setError('Error submitting review');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Leave a Review</h2>
      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message={success} />}
      <div className="form-group">
        <label>Rating</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-control"
          required
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary mt-3">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
