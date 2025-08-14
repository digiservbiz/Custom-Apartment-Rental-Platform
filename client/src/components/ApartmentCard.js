import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ApartmentCard = ({ apartment }) => {
    const checkAvailability = async () => {
        try {
            // You need to get the token from somewhere (e.g., localStorage)
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
            const res = await axios.post(`/api/v1/apartments/${apartment._id}/check-availability`, {}, config);
            alert(res.data.data);
        } catch (err) {
            console.error(err.response.data);
            alert('Error checking availability');
        }
    };

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px' }}>
      <img src={apartment.photos[0]} alt={apartment.location} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <h3>{apartment.location}</h3>
      <p>Price per night: ${apartment.pricePerNight}</p>
      <p>Max guests: {apartment.maxGuests}</p>
      <p>{apartment.description}</p>
      <p>Status: {apartment.status}</p>
      <button onClick={checkAvailability}>Check Availability</button>
      <Link to={`/booking/${apartment._id}`}>
        <button>Book Now</button>
      </Link>
    </div>
  );
};

export default ApartmentCard;
