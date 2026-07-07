import React from 'react';

const COLORS = {
  // Booking statuses
  Confirmed: 'success',
  Pending: 'warning',
  Cancelled: 'secondary',
  // Apartment statuses
  Available: 'success',
  'Pending Confirmation': 'warning',
  // Review / KYC statuses
  Approved: 'success',
  Rejected: 'danger',
  approved: 'success',
  pending: 'warning',
  rejected: 'danger',
};

const StatusBadge = ({ status }) => (
  <span className={`badge bg-${COLORS[status] || 'info'}`}>{status}</span>
);

export default StatusBadge;
