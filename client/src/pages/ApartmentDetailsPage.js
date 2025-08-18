import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import MockMap from '../components/MockMap';
import { useTranslation } from 'react-i18next';

const ApartmentDetailsPage = () => {
  const { id } = useParams();
  const [apartment, setApartment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchApartmentDetails = async () => {
      try {
        const { data: apartmentData } = await axios.get(`/api/v1/apartments/${id}`);
        setApartment(apartmentData.data);

        const { data: reviewsData } = await axios.get(`/api/v1/apartments/${id}/reviews`);
        setReviews(reviewsData.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching apartment details');
        setLoading(false);
      }
    };

    fetchApartmentDetails();
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert type="danger" message={error} />;
  }

  return (
    <div>
      <h1>{apartment.location}</h1>
      <div id="photoCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {apartment.photos.map((photo, index) => (
            <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
              <img src={photo} className="d-block w-100" alt={`Photo ${index + 1}`} />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#photoCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#photoCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      
      <div className="row mt-4">
        <div className="col-md-8">
            <p>{t('price_per_night')}: ${apartment.pricePerNight}</p>
            <p>{t('max_guests')}: {apartment.maxGuests}</p>
            <p>{apartment.description}</p>
        </div>
        <div className="col-md-4">
            <MockMap />
        </div>
      </div>
      
      <div className="mt-4">
        <h2>{t('reviews')}</h2>
        {reviews.length === 0 ? (
            <p>{t('no_reviews_yet')}</p>
        ) : (
            reviews.map((review) => (
            <div key={review._id} className="card mb-3">
                <div className="card-body">
                    <h5 className="card-title">{review.renter.name}</h5>
                    <p className="card-text">{t('rating')}: {review.rating}</p>
                    <p className="card-text">{review.comment}</p>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ApartmentDetailsPage;
