import React from 'react';
import { useParams } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm';

const LeaveReviewPage = () => {
  const { apartmentId } = useParams();

  return (
    <div>
      <h1>Leave a Review</h1>
      <ReviewForm apartmentId={apartmentId} />
    </div>
  );
};

export default LeaveReviewPage;
