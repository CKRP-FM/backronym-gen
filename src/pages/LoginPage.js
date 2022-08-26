import React from 'react';
import AboutModal from '../components/AboutModal';
import Footer from '../components/Footer';
import ErrorModal from '../components/ErrorModal';
import { useState } from 'react';
import Login from '../components/Login';
import SignUp from '../components/SignUp';

function LoginPage() {
  // for auth
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [error, setError] = useState('');
  // this show is for the about modal, to rename
  const [show, setShow] = useState(false);

  const toggleLoginModal = (e) => {
    e.preventDefault();
    setShowLoginModal(!showLoginModal);
  };

  const toggleSignUpModal = (e) => {
    e.preventDefault();
    setShowSignUpModal(!showSignUpModal);
  };

  return (
    <div className="loginPage">
      <nav className="loginPageNav">
        {showLoginModal ? <Login toggleLoginModal={toggleLoginModal} /> : null}
        {showSignUpModal ? <SignUp toggleSignUpModal={toggleSignUpModal} /> : null}
        <div className="aboutPopOut">
          <button className="aboutBtn" onClick={() => setShow(true)}>
            ?
          </button>
          {/* whenever this method is called it will close the modal */}
          <AboutModal onClose={() => setShow(false)} show={show} />
        </div>
      </nav>
      <main className="wrapper">
        <div className="mainSearch loginPageMain">
          <div className="loginPageText">
            <h1>
              Backronym <span>Generator</span>
            </h1>
            <div className="signInOptions">
              <button onClick={(e) => toggleLoginModal(e)}>Log In</button>
              <button onClick={(e) => toggleSignUpModal(e)}>Sign Up</button>
            </div>
          </div>

          <div className="headerImgContainer">
            <img
              src={require('../assets/pen-bulb.png')}
              alt="3D render of a pen with a light bulb attached to the end"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default LoginPage;
