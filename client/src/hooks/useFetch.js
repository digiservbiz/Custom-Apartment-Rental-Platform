import { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';

/**
 * Shared data-fetching hook: GET a URL and track data/loading/error state.
 *
 * @param {string|null} url - API path to fetch. Pass null to skip (e.g. while
 *   waiting for auth); loading resolves to false with no request made.
 * @param {object} [options]
 * @param {string} [options.errorMessage] - Message to show on failure.
 * @returns {{ data: any, loading: boolean, error: string, setData: Function, refetch: Function }}
 */
const useFetch = (url, { errorMessage = 'Failed to load data.' } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState('');

  const fetchData = useCallback(() => {
    if (!url) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    axios
      .get(url)
      .then(({ data: res }) => setData(res.data))
      .catch((err) => setError(err.response?.data?.error || errorMessage))
      .finally(() => setLoading(false));
  }, [url, errorMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, setData, refetch: fetchData };
};

export default useFetch;
