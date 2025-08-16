import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Alert from './Alert';

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

  const { name, email, password, password2, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError('Passwords do not match');
    } else {
      setError('');
      register(name, email, password, role);
    }
  };

  return (
    <form onSubmit={onSubmit}>
        {error && <Alert type="danger" message={error} />}
      <div className="form-group">
        <label>Name</label>
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
        <label>Email Address</label>
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
        <label>Password</label>
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
        <label>Confirm Password</label>
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
        <label>Role</label>
        <select name="role" value={role} onChange={onChange} className="form-control">
          <option value="renter">Renter</option>
          <option value="owner">Owner</option>
          <option value="agent">Agent</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary mt-3">
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
