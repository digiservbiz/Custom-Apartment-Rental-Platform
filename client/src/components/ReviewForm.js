import React, { useState } from 'react';
import axios from '../api/axios';
import Alert from './Alert';

const ReviewForm = ({ apartmentId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`/api/v1/apartments/${apartmentId}/reviews`, { rating: Number(rating), comment });
      setSuccess('Review submitted! It will be visible after moderation.');
      setRating(5);
      setComment('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message={success} />}
      <div className="form-group mb-3">
        <label htmlFor="rating">Rating (1–5)</label>
        <input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="form-control"
          style={{ maxWidth: '100px' }}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="comment">Comment</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-control"
          rows={4}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading || !!success}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
