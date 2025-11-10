import React, { useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import './ChampionsPage.css';
import { useAuth } from '../context/AuthContext';

const ChampionsPage = ({ reels, handleLike }) => {
  const { currentUser } = useAuth();

  // Add useEffect to log reels when they change
  useEffect(() => {
    console.log('ChampionsPage received reels:', reels);
    if (reels && reels.length > 0) {
      console.log('First reel sample:', reels[0]);
    }
  }, [reels]);

  // Check if reels is defined and is an array
  if (!reels || !Array.isArray(reels)) {
    console.warn('Reels is not an array:', reels);
    return (
      <div className="reels-container">
        <p className="no-reels-msg">Loading reels...</p>
      </div>
    );
  }

  return (
    <div className="reels-container">
      {reels.length > 0 ? (
        reels.map(reel => {
          // Validate reel has required fields
          if (!reel || !reel.id || !reel.src) {
            console.warn('Invalid reel:', reel);
            return null;
          }

          const isVideo = reel.type && (
            reel.type.startsWith('video/') || 
            reel.type.includes('video') ||
            reel.src.includes('.mp4') ||
            reel.src.includes('.webm') ||
            reel.src.includes('.mov')
          );

          return (
            <div key={reel.id} className="reel">
              {isVideo ? (
                <video 
                  src={reel.src} 
                  autoPlay 
                  loop 
                  muted 
                  className="reel-media"
                  onError={(e) => {
                    console.error('Failed to load video:', reel.src);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <img 
                  src={reel.src} 
                  alt={reel.uploadedBy?.name ? `${reel.uploadedBy.name}'s post` : 'Reel content'} 
                  className="reel-media"
                  onError={(e) => {
                    console.error('Failed to load image:', reel.src);
                    e.target.src = 'https://via.placeholder.com/400x600?text=Image+Not+Available';
                  }}
                />
              )}
              <div className="reel-user-profile">
                <img 
                  src={reel.uploadedBy?.profilePictureUrl || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1780&auto=format&fit=crop'} 
                  alt={`${reel.uploadedBy?.name || 'User'} profile`} 
                  className="reel-profile-picture"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1780&auto=format&fit=crop';
                  }}
                />
                <div className="reel-user-info">
                  <p className="reel-username">{reel.uploadedBy?.name || 'Unknown User'}</p>
                </div>
              </div>
              <div className="reel-actions">
                <button 
                  onClick={() => handleLike && handleLike(reel.id)} 
                  className={reel.liked ? 'like-btn liked' : 'like-btn'}
                >
                  <FaHeart />
                </button>
                <span>{reel.likes || 0}</span>
              </div>
            </div>
          );
        }).filter(Boolean) // Remove any null entries
      ) : (
        <p className="no-reels-msg">No reels yet. Be the first to upload!</p>
      )}
    </div>
  );
};

export default ChampionsPage;
