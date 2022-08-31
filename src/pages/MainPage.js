import React from 'react';
import Gallery from '../components/Gallery';
import NavBar from '../components/NavBar';
import Search from '../components/Search';
import Footer from '../components/Footer';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function MainPage() {
  const [showGallery, setShowGallery] = useState(2);

  const handleShowGallery = (e) => {
    e.preventDefault();
    // 2 is the initial state (closed gallery), 1 is the state where gallery is open, 0 is the state where gallery is closed AFTER it has been open once
    // the reason why showGallery isn't just a true/false state is because in order for gallery animation to work, it needs to first have class 'gallery', then once open, it has class 'gallery openAnimate' and then once closed, it has class 'openAnimate closeAnimate'
    // however gallery cannot have an initial class of 'openAnimate closeAnimate' as it creates a bug where the closing animation flashes when the component loads due to starting state being false, therefore 3 states are needed to track: initial state, open state and closed state after initial state
    if (showGallery === 2 || showGallery === 0) {
      setShowGallery(1);
    } else {
      setShowGallery(0);
    }
  };

  return (
    <div className="mainPage">
      <Gallery showGallery={showGallery} closeGallery={handleShowGallery} />
      
      <div className="mainPageContent">
        <NavBar />
        <Search />

        <div className="wrapper">
          <div className="mainButtonsContainer">
            <Link to={`/ngramviewer`} className="viewNgramBtn">
              <button className="viewNgramPageBtn">Try the Ngram Viewer</button>
            </Link>
            <button
              className="viewGalleryBtn"
              onClick={(e) => {
                handleShowGallery(e);
              }}
            >View Saved Gallery</button>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}

export default MainPage;
