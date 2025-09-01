import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import AuthContext from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const ProfilePage = () => {
  const { user, loading: userLoading, refreshUser } = useContext(AuthContext);

  // State for Update Details form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    profilePicture: '',
  });
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [detailsSuccess, setDetailsSuccess] = useState('');

  // State for Change Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');


  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        bio: user.bio || '',
        profilePicture: user.profilePicture || '',
      });
    }
  }, [user]);

  const { name, email, bio, profilePicture } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setDetailsLoading(true);
    setDetailsError('');
    setDetailsSuccess('');
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put('/api/v1/auth/updatedetails', { name, email, bio, profilePicture }, config);
      setDetailsSuccess('Profile updated successfully!');
      setDetailsLoading(false);

      // Refresh user context to show updated info immediately
      if (refreshUser) {
        await refreshUser();
      }
    } catch (err) {
      setDetailsError(err.response?.data?.error || 'Failed to update profile.');
      setDetailsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match.');
      setPasswordLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put('/api/v1/auth/updatepassword', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, config);
      setPasswordSuccess('Password changed successfully!');
      setPasswordLoading(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Failed to change password.');
      setPasswordLoading(false);
    }
  };

  if (userLoading) {
    return <Spinner />;
  }

  return (
    <div className="row">
      <div className="col-md-6">
        <h2>Update Profile</h2>
        <p>Manage your account details.</p>

        {profilePicture && (
            <img
                src={profilePicture}
                alt="Profile"
                className="img-fluid rounded-circle mb-3"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/150" }}
            />
        )}

        {detailsError && <Alert type="danger" message={detailsError} />}
        {detailsSuccess && <Alert type="success" message={detailsSuccess} />}

        <form onSubmit={handleDetailsSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="profilePicture">Profile Picture URL</label>
            <input
              type="text"
              id="profilePicture"
              name="profilePicture"
              className="form-control"
              placeholder="https://example.com/image.jpg"
              value={profilePicture}
              onChange={onChange}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              className="form-control"
              rows="3"
              placeholder="Tell us a little about yourself"
              value={bio}
              onChange={onChange}
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary mt-3" disabled={detailsLoading}>
            {detailsLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      <div className="col-md-6">
        <h2>Change Password</h2>

        {passwordError && <Alert type="danger" message={passwordError} />}
        {passwordSuccess && <Alert type="success" message={passwordSuccess} />}

        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              className="form-control"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value })}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className="form-control"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value })}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3" disabled={passwordLoading}>
            {passwordLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
