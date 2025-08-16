import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const ApartmentListPage = () => {
  const [apartments, setApartments] = useState([]);
  const { user: adminUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get('/api/v1/apartments', config);
        setApartments(data.data);
      } catch (error) {
        console.error('Error fetching apartments', error);
      }
    };

    if (adminUser && adminUser.role === 'admin') {
      fetchApartments();
    }
  }, [adminUser]);

  return (
    <div>
      <h1>Manage Apartments</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apartments.map((apartment) => (
            <tr key={apartment._id}>
              <td>{apartment._id}</td>
              <td>{apartment.location}</td>
              <td>${apartment.pricePerNight}</td>
              <td>{apartment.status}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApartmentListPage;
