import Login from './Login';
import { useState } from 'react';

function NavBar() {
  const [showModal, setShowModal] = useState(false);

  const toggleLoginModal = (e) => {
    e.preventDefault();
    setShowModal(!showModal);
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
            <button onClick={(e) => toggleLoginModal(e)}>Log In / Sign Up</button>
          </li>
        </ul>
      </nav>
      {showModal ? <Login toggleLoginModal={toggleLoginModal} /> : null}
    </div>
  );
}

export default NavBar;
