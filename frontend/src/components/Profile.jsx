import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import UploadModal from './UploadModal';
import EditProfileModal from './EditProfileModal'; // Import the new modal component
import './Profile.css';

const Profile = () => {
  const { currentUser, signOut } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchPosts = async (userId) => {
      try {
        const res = await axios.get(`${API}/api/posts/user/${userId}`);
        setPosts(res.data);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/api/profile/me`);
        setProfileData(res.data);
        fetchPosts(res.data._id);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser, API]);

  const handleUploadSuccess = () => {
    // Refetch posts to show the new one
    const fetchPosts = async (userId) => {
      try {
        const res = await axios.get(`${API}/api/posts/user/${userId}`);
        setPosts(res.data);
      } catch (error) {
        console.error('Failed to fetch posts', error);
      }
    };
    if (profileData) {
      fetchPosts(profileData._id);
    }
  };

  const handleSaveProfile = (updatedProfile) => {
    setProfileData(updatedProfile);
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img 
          src={profileData.profilePictureUrl} 
          alt="Profile" 
          className="profile-picture" 
        />
        <div className="profile-info">
          <div className="profile-main-info">
            <h2>{profileData.name}</h2>
            <div className="profile-buttons">
              <button className="edit-profile-btn" onClick={() => setShowEditModal(true)}>Edit Profile</button>
              <button onClick={() => setShowUploadModal(true)} className="upload-btn">Upload</button>
              <button onClick={signOut} className="sign-out-btn">Sign Out</button>
            </div>
          </div>
          <div className="profile-stats">
            <div><strong>{posts.length}</strong> Posts</div>
          </div>
          <div className="profile-bio">
            <p>{profileData.bio}</p>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <div className="tab active">POSTS</div>
      </div>

      <div className="user-events-list">
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post._id} className="profile-event-card">
              <img src={`${API}${post.mediaUrl}`} alt={post.title} className="event-poster" />
              <div className="event-overlay">
                <h4>{post.title}</h4>
              </div>
            </div>
          ))
        ) : (
          <p className="no-events-msg">You haven't uploaded any posts yet.</p>
        )}
      </div>
      {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} onUploadSuccess={handleUploadSuccess} />}
      {showEditModal && (
        <EditProfileModal 
          user={profileData} 
          onClose={() => setShowEditModal(false)} 
          onSave={handleSaveProfile} 
        />
      )}
    </div>
  );
};

export default Profile;
