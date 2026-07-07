import React, { useState } from 'react';
import axios from '../api/axios';
import Alert from '../components/Alert';
import PhotoUploader from '../components/PhotoUploader';

const CreateApartmentPage = () => {
  const [formData, setFormData] = useState({
    location: '',
    photos: '',
    pricePerNight: '',
    maxGuests: '',
    description: '',
    latitude: '',
    longitude: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { location, photos, pricePerNight, maxGuests, description, latitude, longitude } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const newApartment = {
      location,
      photos: photos.split(',').map((photo) => photo.trim()).filter(Boolean),
      pricePerNight,
      maxGuests,
      description,
      latitude: latitude === '' ? undefined : Number(latitude),
      longitude: longitude === '' ? undefined : Number(longitude),
    };
    try {
      await axios.post('/api/v1/apartments', newApartment);
      setSuccess('Apartment created successfully!');
      setError('');
      setFormData({
        location: '',
        photos: '',
        pricePerNight: '',
        maxGuests: '',
        description: '',
        latitude: '',
        longitude: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating apartment');
      setSuccess('');
    }
  };

  return (
    <div>
      <h1>Create Apartment</h1>
      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message={success} />}
      <form onSubmit={onSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={onChange}
            className="form-control"
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
            value={photos}
            onChange={onChange}
            className="form-control"
            required
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
              value={latitude}
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
              value={longitude}
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
            value={pricePerNight}
            onChange={onChange}
            className="form-control"
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
            value={maxGuests}
            onChange={onChange}
            className="form-control"
            min="1"
            required
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            className="form-control"
            rows={4}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary mt-2">Create Apartment</button>
      </form>
    </div>
  );
};

export default CreateApartmentPage;
