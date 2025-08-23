import React, { useState, useEffect, useCallback } from 'react';
import axios from '../api/axios';
import ApartmentCard from '../components/ApartmentCard';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import Filters from '../components/Filters'; // Import the new component
import { useTranslation } from 'react-i18next';

const ApartmentListPage = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [filterParams, setFilterParams] = useState({}); // Central state for all filters
  const { t } = useTranslation();

  const fetchApartments = useCallback(async (pageNumber = 1, filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      params.append('page', pageNumber);

      const { data } = await axios.get(`/api/v1/apartments?${params.toString()}`);
      
      setApartments(data.data);
      setPagination(data.pagination);
      setPage(pageNumber);
    } catch (err) {
      setError('Error fetching apartments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApartments(page, filterParams);
  }, [page, filterParams, fetchApartments]);

  const handleFilterChange = useCallback((newFilters) => {
    setPage(1); // Reset to first page on new filter
    setFilterParams(newFilters);
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <h1>{t('apartments')}</h1>

      <Filters onFilterChange={handleFilterChange} />

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert type="danger" message={error} />
      ) : (
        <>
            <div className="row">
            {apartments.map((apartment) => (
                <div className="col-md-4" key={apartment._id}>
                <ApartmentCard apartment={apartment} />
                </div>
            ))}
            </div>
            <div className="d-flex justify-content-center mt-4">
                {pagination.prev && (
                    <button className="btn btn-outline-primary mx-1" onClick={() => handlePageChange(pagination.prev.page)}>
                        &laquo; Prev
                    </button>
                )}
                {pagination.next && (
                    <button className="btn btn-outline-primary mx-1" onClick={() => handlePageChange(pagination.next.page)}>
                        Next &raquo;
                    </button>
                )}
            </div>
        </>
      )}
    </div>
  );
};

export default ApartmentListPage;
