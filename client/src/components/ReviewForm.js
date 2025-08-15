import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ apartmentId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

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
      alert('Review submitted successfully! It will be visible after moderation.');
      // Optionally redirect or clear the form
      setRating(5);
      setComment('');
    } catch (err) {
      console.error(err.response.data);
      alert('Error submitting review');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Leave a Review</h2>
      <div>
        <label>Rating</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;
