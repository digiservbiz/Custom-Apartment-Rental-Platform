import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ul>
        <li>
          <Link to="/admin/users">Manage Users</Link>
        </li>
        <li>
          <Link to="/admin/apartments">Manage Apartments</Link>
        </li>
        <li>
          <Link to="/admin/reviews">Manage Reviews</Link>
        </li>
        <li>
          <Link to="/admin/kyc">Manage KYC</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboardPage;
