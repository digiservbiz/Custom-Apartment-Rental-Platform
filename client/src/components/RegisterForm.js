import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'renter',
  });
  const { register } = useContext(AuthContext);

  const { name, email, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    register(name, email, password, role);
  };

  return (
    <form onSubmit={onSubmit}>
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
