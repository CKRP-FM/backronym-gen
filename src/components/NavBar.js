import Login from './Login';
import SignUp from './SignUp';
import { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import ErrorModal from './ErrorModal';

function NavBar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [error, setError] = useState('');

  const { user, logOut } = useUserAuth();

  const toggleLoginModal = (e) => {
    e.preventDefault();
    setShowLoginModal(!showLoginModal);
  };

  const toggleSignUpModal = (e) => {
    e.preventDefault();
    setShowSignUpModal(!showSignUpModal);
  };

  const handleUserLogOut = async (e) => {
    try {
      await logOut();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="wrapper">
      {error ? <ErrorModal errorMsg={error} setError={setError} /> : null}
      <nav className="mainNav">
        {user ? (
          <p>
            Currently logged in as <span className="loggedInUser">{user.email ? user.email : 'Anonymous'}</span>
          </p>
        ) : null}

        <ul className="navLinks">
          {/* for when user is on user page, can go back to home */}
          <li>
            {' '}
            <a href="/">Home</a>
          </li>
          {user === null ? (
            <li>
              <button onClick={(e) => toggleLoginModal(e)}>Log In</button>
            </li>
          ) : null}
          {user === null ? (
            <li>
              <button onClick={(e) => toggleSignUpModal(e)}>Sign Up</button>
            </li>
          ) : null}
          {user !== null ? (
            <li>
              <button type="submit" onClick={(e) => handleUserLogOut(e)}>
                Log Out
              </button>
            </li>
          ) : null}
        </ul>
      </nav>
      {showLoginModal ? <Login toggleLoginModal={toggleLoginModal} /> : null}
      {showSignUpModal ? <SignUp toggleSignUpModal={toggleSignUpModal} /> : null}
    </div>
  );
}

export default NavBar;
