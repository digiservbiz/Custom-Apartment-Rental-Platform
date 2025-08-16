import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const { user: adminUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get('/api/v1/users', config);
        setUsers(data.data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    if (adminUser && adminUser.role === 'admin') {
      fetchUsers();
    }
  }, [adminUser]);

  return (
    <div>
      <h1>Manage Users</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
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

export default UserListPage;
