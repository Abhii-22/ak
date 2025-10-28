import React from 'react';
import Home from './Home';
import About from './About';
import Feedback from './Feedback';
import Contact from './Contact';

const MainPage = ({ showUploadForm, addEvent }) => {
  return (
    <>
      <Home showUploadForm={showUploadForm} addEvent={addEvent} />
      <About />
      <Feedback />
      <Contact />
    </>
  );
};

export default MainPage;
