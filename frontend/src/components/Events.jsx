import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaListUl, FaTrophy, FaFutbol, FaBasketballBall, FaMedal, FaAward, FaCrown } from 'react-icons/fa';
import './Events.css';
import Modal from './Modal';
const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const iconMap = {
  FaFutbol: <FaFutbol />,
  FaBasketballBall: <FaBasketballBall />,
};

const prizeIconMap = {
  '1st': <FaCrown className="prize-icon gold" />,
  '2nd': <FaMedal className="prize-icon silver" />,
  '3rd': <FaMedal className="prize-icon bronze" />,
  '4th': <FaAward className="prize-icon" />,
  '5th': <FaAward className="prize-icon" />,
};

const Events = ({ events = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [selectedSport, setSelectedSport] = useState('All');
  const navigate = useNavigate();

  const sports = ['All', 'Kabaddi', 'Cricket', 'Volleyball', 'Tennis', 'Badminton', 'Others'];

  const filteredEvents = selectedSport === 'All' 
    ? events 
    : events.filter(event => event.sportName && event.sportName.toLowerCase() === selectedSport.toLowerCase());

  const openModal = (poster) => {
    setSelectedPoster(poster);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPoster(null);
  };

  return (
    <>
      <div className="events-page">
        <div className="upcoming-events">
          <h1>Upcoming Sports Events</h1>
          <div className="sport-filters">
            {sports.map(sport => (
              <button 
                key={sport}
                className={`filter-btn ${selectedSport === sport ? 'active' : ''}`}
                onClick={() => setSelectedSport(sport)}
              >
                {sport}
              </button>
            ))}
          </div>
          <div className="event-list">
            {filteredEvents.map((event, index) => (
              <div key={event._id || index} className="event-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="event-content">
                  <h2>{iconMap[event.icon]} {event.title}</h2>
                  <p><strong>Sport:</strong> {event.sportName}</p>
                  <p><FaCalendarAlt className="event-icon" /> <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>Timings:</strong> {event.timings}</p>
                  <p><FaMapMarkerAlt className="event-icon" /> <strong>Place:</strong> {event.place}</p>
                  <p><FaListUl className="event-icon" /> <strong>Rules:</strong> {event.rules}</p>
                  {event.prizes && Object.values(event.prizes).some(p => p) && (
                    <div className="event-prizes">
                      <h4><FaTrophy className="event-icon" /> Prizes</h4>
                      <div className="prize-list">
                        {Object.entries(event.prizes).map(([rank, prize]) => (
                          prize && (
                            <div className="prize-ribbon" key={rank}>
                              <span className="prize-rank">{prizeIconMap[rank]} {rank}</span>
                              <span className="prize-amount">{prize}</span>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="event-poster-container">
                  <img src={`${API}${event.poster}`} alt={`${event.title} Poster`} className="event-poster" onClick={() => openModal(`${API}${event.poster}`)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal show={isModalOpen} onClose={closeModal}>
        {selectedPoster && <img src={selectedPoster} alt="Enlarged event poster" />}
      </Modal>
    </>
  );
};

export default Events;
