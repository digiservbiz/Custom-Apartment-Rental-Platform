import React from 'react';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const StatCard = ({ title, value, sub, color }) => (
  <div className="col-md-4 col-sm-6 mb-4">
    <div className={`card border-${color} h-100`}>
      <div className="card-body text-center">
        <h6 className="card-subtitle text-muted mb-1">{title}</h6>
        <p className={`display-6 fw-bold text-${color} mb-0`}>{value}</p>
        {sub && <small className="text-muted">{sub}</small>}
      </div>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const { data: stats, loading, error } = useFetch('/api/v1/admin/stats', {
    errorMessage: 'Failed to load statistics.',
  });

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="mb-4">Admin Dashboard</h1>

      {error && <Alert type="danger" message={error} />}

      {stats && (
        <div className="row mb-4">
          <StatCard title="Total Users" value={stats.totalUsers} color="primary" />
          <StatCard title="Total Apartments" value={stats.totalApartments} color="info" />
          <StatCard title="Total Bookings" value={stats.totalBookings} color="secondary" />
          <StatCard
            title="Platform Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            sub="confirmed bookings"
            color="success"
          />
          <StatCard
            title="Pending KYC"
            value={stats.pendingKyc}
            sub={stats.pendingKyc > 0 ? 'needs review' : 'all clear'}
            color={stats.pendingKyc > 0 ? 'warning' : 'success'}
          />
          <StatCard
            title="Pending Reviews"
            value={stats.pendingReviews}
            sub={stats.pendingReviews > 0 ? 'needs moderation' : 'all clear'}
            color={stats.pendingReviews > 0 ? 'warning' : 'success'}
          />
        </div>
      )}

      <h4 className="mb-3">Quick Actions</h4>
      <div className="list-group list-group-flush" style={{ maxWidth: '400px' }}>
        <Link to="/admin/users" className="list-group-item list-group-item-action">
          👥 Manage Users
        </Link>
        <Link to="/admin/kyc-management" className="list-group-item list-group-item-action">
          🪪 KYC Management
          {stats?.pendingKyc > 0 && (
            <span className="badge bg-warning ms-2">{stats.pendingKyc}</span>
          )}
        </Link>
        <Link to="/admin/review-moderation" className="list-group-item list-group-item-action">
          ⭐ Review Moderation
          {stats?.pendingReviews > 0 && (
            <span className="badge bg-warning ms-2">{stats.pendingReviews}</span>
          )}
        </Link>
        <Link to="/admin/apartments" className="list-group-item list-group-item-action">
          🏠 Manage Apartments
        </Link>
        <Link to="/admin/commission" className="list-group-item list-group-item-action">
          💰 Commission Settings
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
