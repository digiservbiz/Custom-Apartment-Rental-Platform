import React, { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import AuthContext from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';

const KYCListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: adminUser } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get('/api/v1/users', config);
      setUsers(data.data.filter(user => user.kycStatus === 'pending'));
      setLoading(false);
    } catch (err) {
      setError('Error fetching users');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser && adminUser.role === 'admin') {
      fetchUsers();
    }
  }, [adminUser]);

  const handleUpdateStatus = async (id, kycStatus) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`/api/v1/users/${id}/updatestatus`, { kycStatus }, config);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating KYC status', error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Alert type="danger" message={error} />;
  }

  return (
    <div>
      <h1>Manage KYC Requests</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>KYC Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.kycStatus}</td>
              <td>
                <button onClick={() => handleUpdateStatus(user._id, 'approved')} className="btn btn-success btn-sm">Approve</button>
                <button onClick={() => handleUpdateStatus(user._id, 'rejected')} className="btn btn-danger btn-sm ms-2">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KYCListPage;
