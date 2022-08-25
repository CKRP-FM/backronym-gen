import React, { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import ErrorModal from './ErrorModal';

function Login({ toggleLoginModal }) {
  // deconstructing the useUserAuth context to only get what we need (functions to log in)
  const { logIn, logInAnon, user, logOut } = useUserAuth();

  // states to manage user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(true);

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // Log in as created User
  const handleSubmit = async (e) => {
    e.preventDefault();

    // reset error
    setError('');

    // try catch login
    try {
      await logIn(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  // Log in as Anonymous
  const handleAnonLogin = async (e) => {
    e.preventDefault();

    // reset error
    setError('');

    // try catch login as anonymous
    try {
      await logInAnon();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUserLogOut = async (e) => {
    try {
      await logOut();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="logInContainer loginModal">
      <div className="loginContent">
        {user === null ? <h1>Log In</h1> : <h1>Log Out</h1>}
        {/* TO DO: customize the message passed to the error modal */}
        {/* {error ? <ErrorModal errorMsg={error}/> : null} */}

        <button onClick={(e) => toggleLoginModal(e)}>x</button>

        {user === null ? (
          <form className="logInForm">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" onChange={handleEmail} value={email} />
            <label htmlFor="password">Password</label>
            <input type="password" id="email" onChange={handlePassword} value={password} />
            <button type="submit" onClick={(e) => handleSubmit(e)}>
              Log In
            </button>
          </form>
        ) : (
          <button type="submit" onClick={(e) => handleUserLogOut(e)}>
            Log Out
          </button>
        )}

        {user === null ? (
          <button type="submit" onClick={(e) => handleAnonLogin(e)}>
            Log In Anonymously
          </button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default Login;
