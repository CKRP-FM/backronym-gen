import React from 'react';
import Gallery from '../components/Gallery';
import NavBar from '../components/NavBar';
import Search from '../components/Search';
import Footer from '../components/Footer';

function MainPage() {
  return (
    <div className="mainPage">
      <NavBar />
      <Search />
      <Gallery />
      <Footer />
    </div>
  );
}

export default MainPage;
