import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const KYCListPage = () => {
  const [users, setUsers] = useState([]);
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
    } catch (error) {
      console.error('Error fetching users', error);
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

  return (
    <div>
      <h1>Manage KYC Requests</h1>
      <table>
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
                <button onClick={() => handleUpdateStatus(user._id, 'approved')}>Approve</button>
                <button onClick={() => handleUpdateStatus(user._id, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KYCListPage;
