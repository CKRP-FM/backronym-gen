import React, { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import ErrorModal from './ErrorModal';

function Login({ toggleLoginModal }) {
  // deconstructing the useUserAuth context to only get what we need (functions to log in)
  const { logIn, logInAnon, user, logOut } = useUserAuth();

  // states to manage user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  console.log(user);

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
        <h1>Log In</h1>
        {/* TO DO: customize the message passed to the error modal */}
        {error ? <ErrorModal errorMsg={error} setError={setError} /> : null}

        <button className="closeLoginBtn" onClick={(e) => toggleLoginModal(e)}>
          x
        </button>

        <form className="logInForm">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" onChange={handleEmail} value={email} />
          <label htmlFor="password">Password</label>
          <input type="password" id="email" onChange={handlePassword} value={password} />
          <button className="loginBtn" type="submit" onClick={(e) => handleSubmit(e)}>
            Log In
          </button>
        </form>
        {/* ) : (
          <button type="submit" onClick={(e) => handleUserLogOut(e)}>
            Log Out
          </button>
        )} */}

        <div className="logInAnonContainer">
          <p>Proceed without an account?</p>
          <button className="loginAnonBtn" type="submit" onClick={(e) => handleAnonLogin(e)}>
            Log In Anonymously
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
