import Login from './Login';
import SignUp from './SignUp';
import { useState } from 'react';

function NavBar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const toggleLoginModal = (e) => {
    e.preventDefault();
    setShowLoginModal(!showLoginModal);
  };

  const toggleSignUpModal = (e) => {
    e.preventDefault();
    setShowSignUpModal(!showSignUpModal);
  };

  return (
    <div className="wrapper">
      <nav className="mainNav">
        <ul className="navLinks">
          {/* for when user is on user page, can go back to home */}
          <li>
            {' '}
            <a href="/">Home</a>
          </li>
          <li>
            <button onClick={(e) => toggleLoginModal(e)}>Log In</button>
          </li>
          <li>
            <button onClick={(e) => toggleSignUpModal(e)}>Sign Up</button>
          </li>
        </ul>
      </nav>
      {showLoginModal ? <Login toggleLoginModal={toggleLoginModal} /> : null}
      {showSignUpModal ? <SignUp toggleSignUpModal={toggleSignUpModal} /> : null}
    </div>
  );
}

export default NavBar;
