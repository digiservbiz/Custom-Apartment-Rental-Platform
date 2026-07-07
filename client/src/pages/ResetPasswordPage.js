import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Alert from '../components/Alert';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    setError('');
    try {
      await axios.put(`/api/v1/auth/resetpassword/${token}`, { password });
      navigate('/login', { state: { message: 'Password reset successful. Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5 mt-4">
        <h2>Reset Password</h2>
        {error && <Alert type="danger" message={error} />}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              autoFocus
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="confirm">Confirm New Password</label>
            <input
              type="password"
              id="confirm"
              className="form-control"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
