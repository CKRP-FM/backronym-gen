import { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import ErrorModal from './ErrorModal';
import AboutModal from './AboutModal';
import { Link } from 'react-router-dom';

function NavBar() {
  // this show is for the about modal, to rename
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const { user, logOut } = useUserAuth();

  const handleUserLogOut = async (e) => {
    try {
      await logOut();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={user ? 'wrapper' : 'wrapper signedOutHeight'}>
      {error ? <ErrorModal errorMsg={error} setError={setError} /> : null}
      <nav className="mainNav">
        <div className="navLinksContainer">
          <ul className="navLinks">
            {/* for when user is on user page, can go back to home */}
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <Link to={`/ngramviewer`}>Ngram Viewer</Link>
            </li>
            {user !== null ? (
              <li>
                <button type="submit" onClick={(e) => handleUserLogOut(e)}>
                  Log Out
                </button>
              </li>
            ) : null}
          </ul>
          {user ? (
            <p>
              Currently logged in as <span className="loggedInUser">{user.email ? user.email : 'Anonymous'}</span>
            </p>
          ) : null}
          <div className="aboutPopOut">
            <button className="aboutBtn" onClick={() => setShow(true)}>
              ?
            </button>
            {/* whenever this method is called it will close the modal */}
            <AboutModal onClose={() => setShow(false)} show={show} />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
