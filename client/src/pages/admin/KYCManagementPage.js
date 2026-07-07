import React, { useState, useContext } from 'react';
import axios from '../../api/axios';
import AuthContext from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';

const KYCManagementPage = () => {
  const { user: adminUser } = useContext(AuthContext);
  const {
    data: users,
    loading,
    error: fetchError,
    setData: setUsers,
  } = useFetch(adminUser ? '/api/v1/users' : null, {
    errorMessage: 'Error fetching users for KYC approval',
  });
  const [updateError, setUpdateError] = useState('');

  const pendingUsers = (users || []).filter(
    (user) => (user.role === 'owner' || user.role === 'agent') && user.kycStatus === 'pending'
  );

  const handleUpdateKycStatus = async (userId, status) => {
    try {
      await axios.put(`/api/v1/users/${userId}/updatestatus`, { kycStatus: status });
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      setUpdateError('Failed to update KYC status.');
    }
  };

  if (loading) return <Spinner />;

  const error = fetchError || updateError;

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
