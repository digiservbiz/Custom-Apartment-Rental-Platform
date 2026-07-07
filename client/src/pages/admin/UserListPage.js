import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import StatusBadge from '../../components/StatusBadge';

const UserListPage = () => {
  const { user: adminUser } = useContext(AuthContext);
  const { data: users, loading, error } = useFetch(
    adminUser && adminUser.role === 'admin' ? '/api/v1/users' : null,
    { errorMessage: 'Error fetching users' }
  );

  if (loading) return <Spinner />;
  if (error) return <Alert type="danger" message={error} />;

  return (
    <div>
      <h1>Manage Users</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>KYC Status</th>
          </tr>
        </thead>
        <tbody>
          {(users || []).map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <StatusBadge status={user.kycStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListPage;
