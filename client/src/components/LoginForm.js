import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Alert from './Alert';
import { useTranslation } from 'react-i18next';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const { t } = useTranslation();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {error && <Alert type="danger" message={error} />}
      <div className="form-group">
        <label>{t('email_address')}</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>{t('password')}</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          className="form-control"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary mt-3 w-100">
        {t('login')}
      </button>

      <div className="my-3">
        <hr />
        <p className="text-center">OR</p>
      </div>

      <a className="btn btn-danger w-100 mb-2" href="http://localhost:5000/api/v1/auth/google" role="button">
        <i className="fab fa-google me-2"></i> Continue with Google
      </a>
      <a className="btn btn-primary w-100" href="http://localhost:5000/api/v1/auth/facebook" role="button">
        <i className="fab fa-facebook me-2"></i> Continue with Facebook
      </a>
    </form>
  );
};

export default LoginForm;
