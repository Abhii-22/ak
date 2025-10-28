import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import LandingPage from './components/LandingPage';
import MainPage from './components/MainPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Events from './components/Events';
import UploadEventForm from './components/UploadEventForm';
import ChampionsPage from './components/ChampionsPage';
import Profile from './components/Profile'; // Import Profile component
import { AuthProvider } from './context/AuthContext';
import Contact from './components/Contact';

const AppLayout = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [events, setEvents] = useState([]);
  const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API}/api/events`);
        setEvents(res.data);
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
    };

    const fetchAllPosts = async () => {
      try {
        const res = await axios.get(`${API}/api/posts`);
        // Transform posts into reels for the ChampionsPage
        const transformedReels = res.data.map(post => ({
          id: post._id,
          src: `${API}${post.mediaUrl}`,
          type: post.mediaType,
          likes: 0, // Likes are not stored in the backend yet
          liked: false,
        }));
        setReels(transformedReels);
      } catch (error) {
        console.error('Failed to fetch all posts', error);
      }
    };

    fetchEvents();
    fetchAllPosts();
  }, [API]);
  const [reels, setReels] = useState([]);

  const addEvent = (newEvent) => {
    setEvents(prevEvents => [...prevEvents, { ...newEvent, id: prevEvents.length + 1 }]);
    setShowUploadForm(false); // Hide form after submission
  };

  const addReel = (file) => {
    const newId = `item-${Date.now()}`;
    const newUrl = URL.createObjectURL(file);

    // Add to events for profile posts
    const newPost = {
      id: newId,
      poster: newUrl,
      title: file.name,
      date: new Date().toLocaleDateString(),
      uploadedBy: currentUser ? currentUser.email : '',
    };
    setEvents(prevEvents => [newPost, ...prevEvents]);

    // Add to reels for the reels page
    const newReel = {
      id: newId,
      src: newUrl,
      type: file.type,
      likes: 0,
      liked: false
    };
    setReels(prevReels => [newReel, ...prevReels]);
  };

  const handleLike = (reelId) => {
    setReels(reels.map(reel => {
      if (reel.id === reelId) {
        return { ...reel, liked: !reel.liked, likes: reel.liked ? reel.likes - 1 : reel.likes + 1 };
      }
      return reel;
    }));
  };
  const noNavRoutes = ['/', '/signin', '/signup'];
  const shouldShowNav = !noNavRoutes.includes(location.pathname);

  return (
    <div className="App">
      {shouldShowNav && <Header onUploadClick={() => setShowUploadForm(prev => !prev)} />}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<MainPage showUploadForm={showUploadForm} addEvent={addEvent} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/events" element={<Events events={events} />} />
          <Route path="/upload" element={<UploadEventForm addEvent={addEvent} />} />
          <Route path="/reels" element={<ChampionsPage reels={reels} handleLike={handleLike} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<Profile events={events} addReel={addReel} />} />
        </Routes>
      </main>
      {shouldShowNav && <BottomNav />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;
