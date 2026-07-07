import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';

const ApartmentListPage = () => {
  const { user: adminUser } = useContext(AuthContext);
  const { data: apartments, loading, error } = useFetch(
    adminUser && adminUser.role === 'admin' ? '/api/v1/apartments' : null,
    { errorMessage: 'Error fetching apartments' }
  );

  if (loading) return <Spinner />;
  if (error) return <Alert type="danger" message={error} />;

  return (
    <div>
      <h1>Manage Apartments</h1>
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
          {(apartments || []).map((apartment) => (
            <tr key={apartment._id}>
              <td>
                <Link to={`/apartments/${apartment._id}`}>{apartment.location}</Link>
              </td>
              <td>${apartment.pricePerNight}</td>
              <td>
                <StatusBadge status={apartment.status} />
              </td>
              <td>
                <Link to={`/apartments/${apartment._id}/edit`} className="btn btn-sm btn-outline-primary">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApartmentListPage;
