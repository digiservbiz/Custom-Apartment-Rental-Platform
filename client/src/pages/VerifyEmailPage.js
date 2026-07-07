import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`/api/v1/auth/verifyemail/${token}`)
      .then(({ data }) => {
        setStatus('success');
        setMessage(data.data);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. The link may have expired.');
      });
  }, [token]);

  if (status === 'verifying') {
    return (
      <div className="text-center py-5">
        <h1>Verifying your email…</h1>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="text-center py-5">
      {status === 'success' ? (
        <>
          <h1>✅ Email Verified</h1>
          <Alert type="success" message={message} />
          <Link to="/login" className="btn btn-primary mt-3">
            Continue to Login
          </Link>
        </>
      ) : (
        <>
          <h1>Verification Failed</h1>
          <Alert type="danger" message={message} />
          <Link to="/" className="btn btn-outline-primary mt-3">
            Back to Home
          </Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmailPage;
