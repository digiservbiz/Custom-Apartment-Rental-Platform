import React, { useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';

const LoginSuccessPage = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { socialLoginCallback, loading } = useContext(AuthContext);

  useEffect(() => {
    const handleLogin = async () => {
      const params = new URLSearchParams(search);
      const token = params.get('token');

      if (token) {
        await socialLoginCallback(token);
        // After the context has processed the token and updated the user state, redirect.
        navigate('/');
      } else {
        // If no token is found, something went wrong. Redirect to login page.
        console.error("No token found in URL after social login attempt.");
        navigate('/login');
      }
    };

    handleLogin();
  }, [search, navigate, socialLoginCallback]);

  // Display a loading indicator while the token is being processed.
  return (
    <div>
      <h1>Logging you in...</h1>
      <Spinner />
    </div>
  );
};

export default LoginSuccessPage;
