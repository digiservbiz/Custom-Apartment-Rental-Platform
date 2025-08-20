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
        <li>
          <Link to="/admin/kyc-management">Manage KYC Requests</Link>
        </li>
        <li>
          <Link to="/admin/review-moderation">Moderate Reviews</Link>
        </li>
        <li>
          <Link to="/admin/commission">Manage Commission</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboardPage;
