import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Alert from './Alert';
import { useTranslation } from 'react-i18next';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'renter',
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const { t } = useTranslation();

  const { name, email, password, password2, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError(t('passwords_do_not_match'));
    } else {
      setError('');
      register(name, email, password, role);
    }
  };

  return (
    <form onSubmit={onSubmit}>
        {error && <Alert type="danger" message={error} />}
      <div className="form-group">
        <label>{t('name')}</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          className="form-control"
          required
        />
      </div>
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
          minLength="6"
          required
        />
      </div>
      <div className="form-group">
        <label>{t('confirm_password')}</label>
        <input
          type="password"
          name="password2"
          value={password2}
          onChange={onChange}
          className="form-control"
          minLength="6"
          required
        />
      </div>
      <div className="form-group">
        <label>{t('role')}</label>
        <select name="role" value={role} onChange={onChange} className="form-control">
          <option value="renter">{t('renter')}</option>
          <option value="owner">{t('owner')}</option>
          <option value="agent">{t('agent')}</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary mt-3">
        {t('register')}
      </button>
    </form>
  );
};

export default RegisterForm;
