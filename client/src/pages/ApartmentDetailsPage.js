import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ApartmentDetailsPage = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchApartmentDetails = async () => {
      try {
        const { data: apartmentData } = await axios.get(`/api/v1/apartments/${id}`);
        setApartment(apartmentData.data);

        const { data: reviewsData } = await axios.get(`/api/v1/apartments/${id}/reviews`);
        setReviews(reviewsData.data);
      } catch (error) {
        console.error('Error fetching apartment details', error);
      }
    };

    fetchApartmentDetails();
  }, [id]);

  if (!apartment) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{apartment.location}</h1>
      <img src={apartment.photos[0]} alt={apartment.location} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
      <p>Price per night: ${apartment.pricePerNight}</p>
      <p>Max guests: {apartment.maxGuests}</p>
      <p>{apartment.description}</p>

      <h2>Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px' }}>
            <h4>{review.renter.name}</h4>
            <p>Rating: {review.rating}</p>
            <p>{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ApartmentDetailsPage;
