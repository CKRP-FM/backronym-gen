import React from 'react';
import Gallery from '../components/Gallery';
import NavBar from '../components/NavBar';
import Search from '../components/Search';
import Footer from '../components/Footer';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function MainPage() {
  const [showGallery, setShowGallery] = useState(false);

  const handleShowGallery = (e) => {
    e.preventDefault();
    setShowGallery(!showGallery);
  };

  return (
    <div className="mainPage">
      <Gallery showGallery={showGallery} closeGallery={handleShowGallery} />
      <div className="mainPageContent">
        <NavBar />
        <Search />
        <div className="mainButtonsContainer">
          <Link to={`/ngramviewer`} className="viewNgramBtn">
            <button className="viewNgramPageBtn">Try the Ngram Viewer</button>
          </Link>
          <button
            className="viewGalleryBtn"
            onClick={(e) => {
              handleShowGallery(e);
              // document.body.classList.add('modalActive');
            }}
          >
            View Gallery of Saved Backronyms
          </button>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default MainPage;
