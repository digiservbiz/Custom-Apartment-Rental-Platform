import React, { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import AuthContext from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';

const KYCManagementPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: adminUser } = useContext(AuthContext);

  const handleUpdateKycStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`/api/v1/users/${userId}/updatestatus`, { kycStatus: status }, config);

      setPendingUsers(pendingUsers.filter(user => user._id !== userId));
    } catch (err) {
      setError('Failed to update KYC status.');
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get('/api/v1/users', config);

        const filteredUsers = data.data.filter(user =>
          (user.role === 'owner' || user.role === 'agent') && user.kycStatus === 'pending'
        );

        setPendingUsers(filteredUsers);
        setLoading(false);
      } catch (err) {
        setError('Error fetching users for KYC approval');
        setLoading(false);
      }
    };

    if (adminUser) {
      fetchUsers();
    }
  }, [adminUser]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h1>KYC Management</h1>
      {error && <Alert type="danger" message={error} />}
      {pendingUsers.length === 0 ? (
        <p>No pending KYC requests.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleUpdateKycStatus(user._id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => handleUpdateKycStatus(user._id, 'rejected')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KYCManagementPage;
