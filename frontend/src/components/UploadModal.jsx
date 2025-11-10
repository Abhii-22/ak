import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './UploadModal.css';
import { API_BASE_URL } from '../config/api.js';
const API = API_BASE_URL;

const UploadModal = ({ onClose, onUploadSuccess }) => {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!token) {
      setError('You must be logged in to upload');
      return;
    }

    setUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('media', file);
    formData.append('title', title);

    try {
      const response = await axios.post(`${API}/api/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      });
      console.log('Post uploaded successfully:', response.data);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Failed to upload post', err);
      if (err.response) {
        setError(err.response.data?.msg || 'Upload failed. Please try again.');
      } else {
        setError('Upload failed. Please check your connection and try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Upload Media</h2>
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        {error && <p className="error-message">{error}</p>}
        <div className="modal-actions">
          <button onClick={handleSubmit} disabled={!file || uploading}>
            {uploading ? 'Uploading...' : 'Submit'}
          </button>
          <button onClick={onClose} disabled={uploading}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
