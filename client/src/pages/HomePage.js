import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-5 mb-4 bg-light rounded-3">
      <div className="container-fluid py-5">
        <h1 className="display-5 fw-bold">{t('home_title')}</h1>
        <p className="col-md-8 fs-4">
          {t('home_subtitle')}
        </p>
        <Link to="/apartments">
          <button className="btn btn-primary btn-lg" type="button">
            {t('browse_apartments')}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
