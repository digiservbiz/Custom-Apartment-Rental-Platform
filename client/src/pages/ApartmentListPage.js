import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApartmentCard from '../components/ApartmentCard';

const ApartmentListPage = () => {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    const fetchApartments = async () => {
      const { data } = await axios.get('/api/v1/apartments');
      setApartments(data.data);
    };

    fetchApartments();
  }, []);

  return (
    <div>
      <h1>Apartments</h1>
      <div>
        {apartments.map((apartment) => (
          <ApartmentCard key={apartment._id} apartment={apartment} />
        ))}
      </div>
    </div>
  );
};

export default ApartmentListPage;
