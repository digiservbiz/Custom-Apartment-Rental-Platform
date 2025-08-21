import React, { useState } from 'react';
import axios from '../api/axios';
import Alert from '../components/Alert';

const CreateApartmentPage = () => {
  const [formData, setFormData] = useState({
    location: '',
    photos: '',
    pricePerNight: '',
    maxGuests: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { location, photos, pricePerNight, maxGuests, description } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const newApartment = {
        location,
        photos: photos.split(',').map(photo => photo.trim()),
        pricePerNight,
        maxGuests,
        description
    }
    try {
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }
        const body = JSON.stringify(newApartment);
        await axios.post('/api/v1/apartments', body, config);
        setSuccess('Apartment created successfully!');
        setError('');
        setFormData({
            location: '',
            photos: '',
            pricePerNight: '',
            maxGuests: '',
            description: '',
        });
    } catch (err) {
        setError('Error creating apartment');
        setSuccess('');
    }
  };

  return (
    <div>
      <h1>Create Apartment</h1>
      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message={success} />}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={location}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Photos (comma separated URLs)</label>
          <input
            type="text"
            name="photos"
            value={photos}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Price Per Night</label>
          <input
            type="number"
            name="pricePerNight"
            value={pricePerNight}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Max Guests</label>
          <input
            type="number"
            name="maxGuests"
            value={maxGuests}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={description}
            onChange={onChange}
            className="form-control"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Create Apartment</button>
      </form>
    </div>
  );
};

export default CreateApartmentPage;
