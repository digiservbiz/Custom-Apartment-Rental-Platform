import React, { useState } from 'react';
import axios from 'axios';

const CreateApartmentPage = () => {
  const [formData, setFormData] = useState({
    location: '',
    photos: '',
    pricePerNight: '',
    maxGuests: '',
    description: '',
  });

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
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const body = JSON.stringify(newApartment);
        const res = await axios.post('/api/v1/apartments', body, config);
        console.log(res.data);
    } catch (err) {
        console.error(err.response.data);
    }
  };

  return (
    <div>
      <h1>Create Apartment</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={location}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Photos (comma separated URLs)</label>
          <input
            type="text"
            name="photos"
            value={photos}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Price Per Night</label>
          <input
            type="number"
            name="pricePerNight"
            value={pricePerNight}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Max Guests</label>
          <input
            type="number"
            name="maxGuests"
            value={maxGuests}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={description}
            onChange={onChange}
            required
          ></textarea>
        </div>
        <button type="submit">Create Apartment</button>
      </form>
    </div>
  );
};

export default CreateApartmentPage;
