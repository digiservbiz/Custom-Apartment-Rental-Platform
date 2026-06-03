import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isOwnerOrAgent = user && (user.role === 'owner' || user.role === 'agent');
  const isAdmin = user && user.role === 'admin';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          {t('app_title')}
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setNavOpen((o) => !o)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse${navOpen ? ' show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <Link className="nav-link" to="/apartments" onClick={() => setNavOpen(false)}>
                {t('apartments')}
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-bookings" onClick={() => setNavOpen(false)}>
                    {t('my_bookings')}
                  </Link>
                </li>

                {(isOwnerOrAgent || isAdmin) && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/my-apartments" onClick={() => setNavOpen(false)}>
                        {t('my_apartments')}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/owner-bookings" onClick={() => setNavOpen(false)}>
                        Bookings Received
                      </Link>
                    </li>
                  </>
                )}

                {isAdmin && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard" onClick={() => setNavOpen(false)}>
                      {t('admin')}
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <Link className="nav-link" to="/profile" onClick={() => setNavOpen(false)}>
                    {t('my_profile')}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-secondary btn-sm ms-lg-2" onClick={handleLogout}>
                    {t('logout')}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={() => setNavOpen(false)}>
                    {t('login')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={() => setNavOpen(false)}>
                    {t('register')}
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="ms-lg-3">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
