import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApartmentCard from '../components/ApartmentCard';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useTranslation } from 'react-i18next';

const ApartmentListPage = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [price, setPrice] = useState({ min: '', max: '' });
  const [guests, setGuests] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const { t } = useTranslation();

  const fetchApartments = async (pageNumber = 1) => {
    try {
      setLoading(true);
      let url = `/api/v1/apartments?keyword=${keyword}&page=${pageNumber}`;
      if (price.min) url += `&pricePerNight[gte]=${price.min}`;
      if (price.max) url += `&pricePerNight[lte]=${price.max}`;
      if (guests) url += `&maxGuests[gte]=${guests}`;
      
      const { data } = await axios.get(url);
      setApartments(data.data);
      setPagination(data.pagination);
      setPage(pageNumber);
      setLoading(false);
    } catch (err) {
      setError('Error fetching apartments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    fetchApartments();
  };

  return (
    <div>
      <h1>{t('apartments')}</h1>
      <form onSubmit={submitHandler} className="mb-4">
        <div className="row">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder={t('search_by_location')}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder={t('min_price')}
              value={price.min}
              onChange={(e) => setPrice({ ...price, min: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder={t('max_price')}
              value={price.max}
              onChange={(e) => setPrice({ ...price, max: e.target.value })}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder={t('guests')}
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary mt-2" type="submit">
          {t('apply_filters')}
        </button>
      </form>

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
                    <button className="btn btn-outline-primary mx-1" onClick={() => fetchApartments(pagination.prev.page)}>
                        &laquo; Prev
                    </button>
                )}
                {pagination.next && (
                    <button className="btn btn-outline-primary mx-1" onClick={() => fetchApartments(pagination.next.page)}>
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
