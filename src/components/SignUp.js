import React, { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import ErrorModal from './ErrorModal';

function SignUp({ toggleSignUpModal }) {
  // deconstructing the useUserAuth context to only get what we need (functions to sign up)
  const { signUp } = useUserAuth();

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

  // Sign up as new user
  const handleSubmit = async (e) => {
    e.preventDefault();

    // try catch sign up
    try {
      await signUp(email, password);
      toggleSignUpModal(e);
    } catch (err) {
      setError(err.message);
    }

    // setUserStatus(true);
  };

  return (
    <div className="signUpContainer signUpModal">
      <div className="signUpContent">
        <h1>Sign Up</h1>
        {error ? <ErrorModal errorMsg={error} setError={setError} /> : null}
        <button className="closeBtn" onClick={(e) => toggleSignUpModal(e)}>
          x
        </button>
        <form className="signUpForm">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" onChange={handleEmail} value={email} />
          <label htmlFor="password">Password</label>
          <input type="password" id="email" onChange={handlePassword} value={password} />
          <button className="signUpBtn" type="submit" onClick={(e) => handleSubmit(e)}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
