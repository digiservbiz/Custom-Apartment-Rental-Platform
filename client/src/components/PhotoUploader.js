import React, { useRef, useState } from 'react';
import axios from '../api/axios';

/**
 * File-upload widget for apartment photos. Uploads selected images to the
 * server (Cloudinary-backed) and reports the hosted URLs via onUploaded.
 * Falls back gracefully if the server has no upload provider configured.
 */
const PhotoUploader = ({ onUploaded }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError('');
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('photos', file));

    try {
      const { data } = await axios.post('/api/v1/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploaded(data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. You can still paste image URLs below.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="mb-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="form-control"
        onChange={handleChange}
        disabled={uploading}
        aria-label="Upload photos"
      />
      {uploading && <small className="text-muted">Uploading…</small>}
      {error && <small className="text-danger d-block">{error}</small>}
    </div>
  );
};

export default PhotoUploader;
