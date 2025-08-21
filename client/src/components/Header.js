import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { t } = useTranslation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          {t('app_title')}
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/apartments">
                    {t('apartments')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-bookings">
                    {t('my_bookings')}
                  </Link>
                </li>
                {user.role === 'owner' || user.role === 'agent' || user.role === 'admin' && (
                    <li className="nav-item">
                        <Link className="nav-link" to="/my-apartments">
                        {t('my_apartments')}
                        </Link>
                    </li>
                )}
                {user.role === 'admin' && (
                    <li className="nav-item">
                        <Link className="nav-link" to="/admin/dashboard">
                        {t('admin')}
                        </Link>
                    </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    {t('my_profile')}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={logout}>
                    {t('logout')}
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    {t('login')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    {t('register')}
                  </Link>
                </li>
              </>
            )}
          </ul>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Header;
