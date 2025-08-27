import React, { useState } from 'react';
import axios from '../api/axios';
import Alert from '../components/Alert';

const CreateApartmentPage = () => {
  const [formData, setFormData] = useState({
    address: '',
    photos: '',
    pricePerNight: '',
    maxGuests: '',
    description: '',
    amenities: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { address, photos, pricePerNight, maxGuests, description, amenities } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const newApartment = {
        address,
        photos: photos.split(',').map(photo => photo.trim()),
        pricePerNight,
        maxGuests,
        description,
        amenities: amenities.split(',').map(amenity => amenity.trim()),
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
        setSuccess('Apartment created successfully! You will be redirected to your apartments list.');
        setError('');
        setFormData({
            address: '',
            photos: '',
            pricePerNight: '',
            maxGuests: '',
            description: '',
            amenities: '',
        });
        // Optional: redirect user after a delay
        setTimeout(() => {
            // Assuming you have history or navigate object from react-router-dom
            // For simplicity, we'll just clear the success message
            setSuccess('');
        }, 3000);
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
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={address}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Photos (comma-separated URLs)</label>
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
            <label>Amenities (comma-separated)</label>
            <input
                type="text"
                name="amenities"
                value={amenities}
                onChange={onChange}
                className="form-control"
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
