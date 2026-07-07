import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import PhotoUploader from '../components/PhotoUploader';

const EditApartmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    photos: '',
    pricePerNight: '',
    maxGuests: '',
    description: '',
    status: 'Available',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const { data } = await axios.get(`/api/v1/apartments/${id}`);
        const apt = data.data;
        setFormData({
          location: apt.location,
          photos: apt.photos.join(', '),
          pricePerNight: apt.pricePerNight,
          maxGuests: apt.maxGuests,
          description: apt.description,
          status: apt.status,
          latitude: apt.latitude ?? '',
          longitude: apt.longitude ?? '',
        });
      } catch {
        setError('Failed to load apartment details.');
      } finally {
        setLoading(false);
      }
    };
    fetchApartment();
  }, [id]);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await axios.put(`/api/v1/apartments/${id}`, {
        ...formData,
        photos: formData.photos
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
        pricePerNight: Number(formData.pricePerNight),
        maxGuests: Number(formData.maxGuests),
        latitude: formData.latitude === '' ? undefined : Number(formData.latitude),
        longitude: formData.longitude === '' ? undefined : Number(formData.longitude),
      });
      navigate('/my-apartments');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update apartment.');
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1>Edit Apartment</h1>
      {error && <Alert type="danger" message={error} />}
      <form onSubmit={onSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-control"
            value={formData.location}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Upload Photos</label>
          <PhotoUploader
            onUploaded={(urls) =>
              setFormData((prev) => ({
                ...prev,
                photos: [prev.photos, urls.join(', ')].filter(Boolean).join(', '),
              }))
            }
          />
          <label htmlFor="photos">Photos (comma-separated URLs)</label>
          <input
            type="text"
            id="photos"
            name="photos"
            className="form-control"
            value={formData.photos}
            onChange={onChange}
          />
        </div>
        <div className="row">
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="latitude">Latitude (optional, for the map)</label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              className="form-control"
              value={formData.latitude}
              onChange={onChange}
              step="any"
              min="-90"
              max="90"
              placeholder="e.g. 40.7128"
            />
          </div>
          <div className="col-md-6 form-group mb-3">
            <label htmlFor="longitude">Longitude (optional, for the map)</label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              className="form-control"
              value={formData.longitude}
              onChange={onChange}
              step="any"
              min="-180"
              max="180"
              placeholder="e.g. -74.0060"
            />
          </div>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="pricePerNight">Price Per Night ($)</label>
          <input
            type="number"
            id="pricePerNight"
            name="pricePerNight"
            className="form-control"
            value={formData.pricePerNight}
            onChange={onChange}
            min="1"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="maxGuests">Max Guests</label>
          <input
            type="number"
            id="maxGuests"
            name="maxGuests"
            className="form-control"
            value={formData.maxGuests}
            onChange={onChange}
            min="1"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows={4}
            value={formData.description}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            className="form-control"
            value={formData.status}
            onChange={onChange}
          >
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/my-apartments')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditApartmentPage;
