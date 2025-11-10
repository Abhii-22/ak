import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from './config/api.js';
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
import Profile from './components/Profile';
import { AuthProvider } from './context/AuthContext';
import Contact from './components/Contact';

const AppLayout = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const API = API_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch events
        const eventsRes = await axios.get(`${API}/api/events`);
        if (eventsRes.data && Array.isArray(eventsRes.data)) {
          setEvents(eventsRes.data);
          console.log(`Loaded ${eventsRes.data.length} events`);
        }

        // Fetch posts
        const postsRes = await axios.get(`${API}/api/posts`);
        if (postsRes.data && Array.isArray(postsRes.data)) {
          const transformedReels = postsRes.data.map(post => ({
            id: post._id,
            src: `${API}${post.mediaUrl}`,
            type: post.mediaType || 'image/jpeg',
            likes: post.likes || 0,
            uploadedBy: post.user || { name: 'Anonymous' }
          })).filter(reel => reel.src);
          setReels(transformedReels);
          console.log(`Loaded ${transformedReels.length} posts`);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API]);

  const addEvent = async (newEvent) => {
    try {
      const res = await axios.get(`${API}/api/events`);
      if (res.data && Array.isArray(res.data)) {
        setEvents(res.data);
        console.log(`Refreshed: ${res.data.length} events loaded`);
      }
    } catch (error) {
      console.error('Failed to refresh events:', error);
    }
    setShowUploadForm(false);
  };

  const handleLike = async (reelId) => {
    try {
      const currentReel = reels.find(reel => reel.id === reelId);
      if (!currentReel) return;

      const endpoint = currentReel.liked ? 'unlike' : 'like';
      const response = await axios.put(`${API}/api/posts/${reelId}/${endpoint}`, {}, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });

      setReels(reels.map(reel => {
        if (reel.id === reelId) {
          return { 
            ...reel, 
            liked: response.data.liked, 
            likes: response.data.likes 
          };
        }
        return reel;
      }));
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
      setReels(reels.map(reel => {
        if (reel.id === reelId) {
          return { ...reel, liked: !reel.liked, likes: reel.liked ? reel.likes - 1 : reel.likes + 1 };
        }
        return reel;
      }));
    }
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
          <Route path="/profile" element={<Profile events={events} />} />
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
