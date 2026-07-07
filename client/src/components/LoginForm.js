import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Alert from './Alert';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const location = useLocation();
  const successMsg = location.state?.message || '';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { t } = useTranslation();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {successMsg && <Alert type="success" message={successMsg} />}
      {error && <Alert type="danger" message={error} />}
      <div className="form-group mb-3">
        <label htmlFor="email">{t('email_address')}</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          className="form-control"
          required
          autoFocus
        />
      </div>
      <div className="form-group mb-1">
        <label htmlFor="password">{t('password')}</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          className="form-control"
          required
        />
      </div>
      <div className="text-end mb-3">
        <Link to="/forgot-password" className="small text-muted">
          Forgot password?
        </Link>
      </div>
      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? 'Logging in...' : t('login')}
      </button>

      <div className="my-3">
        <hr />
        <p className="text-center text-muted small">OR</p>
      </div>

      <a
        className="btn btn-danger w-100 mb-2"
        href={`${process.env.REACT_APP_API_URL}/api/v1/auth/google`}
        role="button"
      >
        Continue with Google
      </a>
      <a
        className="btn btn-primary w-100"
        href={`${process.env.REACT_APP_API_URL}/api/v1/auth/facebook`}
        role="button"
      >
        Continue with Facebook
      </a>
    </form>
  );
};

export default LoginForm;
