import React from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './UploadEventForm.css';

const UploadEventForm = ({ addEvent }) => {
  const { token } = useAuth();
  const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-auth-token': token,
      },
    };

    try {
      const res = await axios.post(`${API}/api/events`, formData, config);
      addEvent(res.data);
    } catch (error) {
      console.error('Failed to upload event', error);
    }
  };

  return (
    <div className="upload-event-form-container">
      <h2>Upload Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="eventTitle">Event Title</label>
          <input type="text" id="eventTitle" name="title" />
        </div>
        <div className="form-group">
          <label htmlFor="sportName">Sport Name</label>
          <input type="text" id="sportName" name="sportName" />
        </div>
        <div className="form-group">
          <label htmlFor="eventPlace">Event Place</label>
          <input type="text" id="eventPlace" name="place" />
        </div>
        <div className="form-group">
          <label htmlFor="eventDate">Event Date</label>
          <input type="date" id="eventDate" name="date" />
        </div>
        <div className="form-group">
          <label htmlFor="eventTimings">Event Timings</label>
          <input type="text" id="eventTimings" name="timings" />
        </div>
        <div className="form-group">
          <label htmlFor="eventRules">Event Rules</label>
          <textarea id="eventRules" name="rules"></textarea>
        </div>

        <div className="prizes-section">
          <h4>Prizes</h4>
          <div className="prize-input">
            <label>1st</label>
            <input type="text" name="prize1" placeholder="Prize for 1st place" />
          </div>
          <div className="prize-input">
            <label>2nd</label>
            <input type="text" name="prize2" placeholder="Prize for 2nd place" />
          </div>
          <div className="prize-input">
            <label>3rd</label>
            <input type="text" name="prize3" placeholder="Prize for 3rd place" />
          </div>
          <div className="prize-input">
            <label>4th</label>
            <input type="text" name="prize4" placeholder="Prize for 4th place" />
          </div>
          <div className="prize-input">
            <label>5th</label>
            <input type="text" name="prize5" placeholder="Prize for 5th place" />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="eventImage">Event Image</label>
          <input type="file" id="eventImage" name="eventImage" />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadEventForm;
