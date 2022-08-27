import React, { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import ErrorModal from './ErrorModal';
import { useNavigate } from 'react-router-dom';

function Login({ toggleSignUpModal }) {
  // deconstructing the useUserAuth context to only get what we need (functions to log in)
  const { logIn, logInAnon } = useUserAuth();

  // redirect user to another page
  const navigate = useNavigate();

  // states to manage user input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // Log in as created User
  const handleSubmit = async (e) => {
    e.preventDefault();

    // try catch login
    try {
      await logIn(email, password);
      // redirect user to the home following a successful sign up
      navigate('/');
    } catch (err) {
      setError(err.message);
    }

    // setUserStatus(true);
  };

  // Log in as Anonymous
  const handleAnonLogin = async (e) => {
    e.preventDefault();

    // try catch login as anonymous
    try {
      await logInAnon();
      // redirect user to the login page
      navigate('/');
    } catch (err) {
      setError(err.message);
    }

    // setUserStatus(true);
  };

  return (
    <div className="loginContainer" >
      <h2>Account Log In</h2>
      {error ? <ErrorModal errorMsg={error} setError={setError} /> : null}

      <form className="logInForm">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" onChange={handleEmail} value={email} />
        <label htmlFor="password">Password</label>
        <input type="password" id="email" onChange={handlePassword} value={password} />
        <button className="loginBtn" type="submit" onClick={(e) => handleSubmit(e)}>
          Log In
        </button>
      </form>

      <div className="logInAnonContainer">
        <p>Don't have an account?</p>

        <div className="signUpControls">
          <button className="loginAnonBtn" type="submit" onClick={(e) => handleAnonLogin(e)}>
            Log In Anonymously
          </button>
          <p>or</p>
          <button onClick={(e) => toggleSignUpModal(e)}>Sign Up</button>
        </div>

      </div>
    </div>
  );
}

export default Login;
