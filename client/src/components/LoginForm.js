import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login } = useContext(AuthContext);

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={onSubmit}>
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
          required
        />
      </div>
      <button type="submit" className="btn btn-primary mt-3">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
