import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';

const ApartmentListPage = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
        setLoading(false);
      } catch (err) {
        setError('Error fetching apartments');
        setLoading(false);
      }
    };

    if (adminUser && adminUser.role === 'admin') {
      fetchApartments();
    }
  }, [adminUser]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert type="danger" message={error} />;
  }

  return (
    <div>
      <h1>Manage Apartments</h1>
      <table className="table table-striped">
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
                <button className="btn btn-primary btn-sm">Edit</button>
                <button className="btn btn-danger btn-sm ms-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApartmentListPage;
