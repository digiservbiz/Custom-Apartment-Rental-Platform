import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="p-5 mb-4 bg-light rounded-3">
      <div className="container-fluid py-5">
        <h1 className="display-5 fw-bold">Find Your Perfect Rental</h1>
        <p className="col-md-8 fs-4">
          The best apartments in the city, just a few clicks away.
        </p>
        <Link to="/apartments">
          <button className="btn btn-primary btn-lg" type="button">
            Browse Apartments
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
