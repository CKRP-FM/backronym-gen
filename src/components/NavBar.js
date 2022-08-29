import { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import ErrorModal from './ErrorModal';
import AboutModal from './AboutModal';
import { Link } from 'react-router-dom';

function NavBar() {
  // this show is for the about modal, to rename
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [nav, setNav] = useState(false);

  //hide overflowing elements when slide out nav is shown on page
  // useEffect(() => {
  //   if (nav === true) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = 'auto';
  //   }
  // }, [nav])

  const { user, logOut } = useUserAuth();

  const handleUserLogOut = async (e) => {
    try {
      await logOut();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleNav = () => {
    setNav(!nav);
  }

  return (
    <div className={user ? 'wrapper' : 'wrapper signedOutHeight'}>
      {error ? <ErrorModal errorMsg={error} setError={setError} /> : null}

      {user ? (
        <p className='currentUser'>
          Currently logged in as <Link to={`/profile/${user.uid}`}><span className="loggedInUser profileLink">{user.email ? user.email : 'Anonymous'}</span></Link>
        </p>
      ) : null}

      <nav className="mainNav">
        <div className="hamburgerMenu"
          onClick={toggleNav}
        >
          <span className={`top ${nav ? 'topClosed' : ''}`}></span>
          <span className={`mid ${nav ? 'midClosed' : ''}`}></span>
          <span className={`bottom ${nav ? 'bottomClosed' : ''}`}></span>
        </div>

        <div className="navLinksContainer">
          <div className={`navLinks ${nav ? 'showNav' : ''}`}>
          <ul className="linkContainer" onClick={toggleNav}>
            {/* for when user is on user page, can go back to home */}
            <li>
              <Link to={`/`}>Home</Link>
            </li>

            <li>
              <Link to={`/ngramviewer`}>Ngram Viewer</Link>
            </li>

            {user ? (
              <li>
                <Link to={`/profile/${user.uid}`}>Profile</Link>
              </li>
            )
              : null
            }

            {user !== null ? (
              <li>
                <button type="submit" onClick={(e) => handleUserLogOut(e)}>
                  Log Out
                </button>
              </li>
            ) : null}
          </ul>
          </div>
        </div>

        <div className="aboutPopOut">
          <button className="aboutBtn" onClick={() => setShow(true)}>
            ?
          </button>
          {/* whenever this method is called it will close the modal */}
          <AboutModal onClose={() => setShow(false)} show={show} />
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
