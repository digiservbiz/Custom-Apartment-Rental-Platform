import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';

const CommissionPage = () => {
  const [commission, setCommission] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCommission = async () => {
      try {
        const { data } = await axios.get('/api/v1/settings/commission_fee');
        setCommission(data.data.value);
        setLoading(false);
      } catch (err) {
        setError('Error fetching commission fee.');
        setLoading(false);
      }
    };

    fetchCommission();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put('/api/v1/settings/commission_fee', { value: commission }, config);
      setSuccess('Commission fee updated successfully!');
    } catch (err) {
      setError('Failed to update commission fee.');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h1>Commission Fee Management</h1>
      <p>Set the commission fee percentage for all transactions on the platform.</p>

      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message={success} />}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="commission">Commission Fee (%)</label>
          <input
            type="number"
            id="commission"
            className="form-control"
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            placeholder="e.g., 10"
            required
            min="0"
            max="100"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Save Commission Fee
        </button>
      </form>
    </div>
  );
};

export default CommissionPage;
