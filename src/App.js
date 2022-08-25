import './App.scss';
import Gallery from './components/Gallery';
import Search from './components/Search';
import Footer from './components/Footer';
import { UserAuthContextProvider } from './context/UserAuthContext';
import NavBar from './components/NavBar';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const setUserStatus = (status) => {
    setIsUserLoggedIn(status);
  }

  return (
    <UserAuthContextProvider>
      <div className="App">
        <Routes>
          <Route path="/" element={
            isUserLoggedIn ?
              <div>
                <NavBar setUserStatus={setUserStatus}/>
                <Search />
                <Gallery />
              </div> : 
              <NavBar setUserStatus={setUserStatus}/>
          } />
        </Routes>

        <Footer />
      </div>
    </UserAuthContextProvider>
  );
}

export default App;
