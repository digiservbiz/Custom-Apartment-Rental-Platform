import React from 'react';

const ApartmentCard = ({ apartment }) => {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px' }}>
      <img src={apartment.photos[0]} alt={apartment.location} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <h3>{apartment.location}</h3>
      <p>Price per night: ${apartment.pricePerNight}</p>
      <p>Max guests: {apartment.maxGuests}</p>
      <p>{apartment.description}</p>
    </div>
  );
};

export default ApartmentCard;
