import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const MyApartmentsPage = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMyApartments = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get('/api/v1/apartments/myapartments', config);
        setApartments(data.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching my apartments');
        setLoading(false);
      }
    };

    if (user) {
        fetchMyApartments();
    } else {
        setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert type="danger" message={error} />;
  }

  return (
    <div>
      <h1>My Apartments</h1>
      <Link to="/create-apartment" className="btn btn-primary mb-3">
        Create New Apartment
      </Link>
      {apartments.length === 0 ? (
        <p>You have no apartments.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Location</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((apartment) => (
              <tr key={apartment._id}>
                <td>{apartment.location}</td>
                <td>${apartment.pricePerNight}</td>
                <td>{apartment.status}</td>
                <td>
                  <Link to={`/apartments/${apartment._id}/edit`} className="btn btn-primary btn-sm">Edit</Link>
                  <button className="btn btn-danger btn-sm ms-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyApartmentsPage;
