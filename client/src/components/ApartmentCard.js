import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';

const ApartmentCard = ({ apartment }) => {
  const { user } = useContext(AuthContext);
  const [availMsg, setAvailMsg] = useState('');
  const [checkingAvail, setCheckingAvail] = useState(false);

  const handleCheckAvailability = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setCheckingAvail(true);
    setAvailMsg('');
    try {
      const { data } = await axios.post(
        `/api/v1/apartments/${apartment._id}/check-availability`,
        {}
      );
      setAvailMsg(data.data);
    } catch (err) {
      setAvailMsg(err.response?.data?.error || 'Error checking availability');
    } finally {
      setCheckingAvail(false);
    }
  };

  const isRenter = user && user.role === 'renter';

  return (
    <div className="card h-100 shadow-sm">
      <Link to={`/apartments/${apartment._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {apartment.photos && apartment.photos[0] ? (
          <img
            src={apartment.photos[0]}
            className="card-img-top"
            alt={apartment.location}
            style={{ height: '200px', objectFit: 'cover' }}
          />
        ) : (
          <div
            className="card-img-top bg-secondary d-flex align-items-center justify-content-center"
            style={{ height: '200px' }}
          >
            <span className="text-white">No Image</span>
          </div>
        )}
        <div className="card-body">
          <h5 className="card-title">{apartment.location}</h5>
          <p className="card-text text-muted small">{apartment.description?.slice(0, 80)}…</p>
          <p className="card-text fw-bold">${apartment.pricePerNight} / night</p>
          <p className="card-text small">
            <span className={`badge bg-${apartment.status === 'Available' ? 'success' : 'secondary'}`}>
              {apartment.status}
            </span>
            &nbsp;· Up to {apartment.maxGuests} guests
          </p>
        </div>
      </Link>
      {isRenter && (
        <div className="card-footer bg-white border-top-0 d-flex gap-2">
          <button
            className="btn btn-outline-info btn-sm flex-grow-1"
            onClick={handleCheckAvailability}
            disabled={checkingAvail}
          >
            {checkingAvail ? 'Checking…' : 'Check Availability'}
          </button>
          <Link to={`/booking/${apartment._id}`} className="btn btn-primary btn-sm flex-grow-1">
            Book Now
          </Link>
        </div>
      )}
      {availMsg && (
        <div className="card-footer">
          <small className="text-info">{availMsg}</small>
        </div>
      )}
    </div>
  );
};

export default ApartmentCard;
