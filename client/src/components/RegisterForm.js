import React, { useState } from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'renter',
  });

  const { name, email, password, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <label>Role</label>
        <select name="role" value={role} onChange={onChange}>
          <option value="renter">Renter</option>
          <option value="owner">Owner</option>
          <option value="agent">Agent</option>
        </select>
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
