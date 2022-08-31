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
  const [hasSignedUp, setHasSignedUp] = useState(false);

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
      setHasSignedUp(true);
      setTimeout(() => {
        toggleSignUpModal(e);
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signUpContainer signUpModal">
      <div className="signUpContent">
        <h2>Sign Up</h2>
        {error ? <ErrorModal errorMsg={error} setError={setError} /> : null}
        <button className="closeBtn" onClick={(e) => toggleSignUpModal(e)}>
          <span className="sr-only">Close</span>X
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

        {hasSignedUp ? <p>Sign up successful. Redirecting to login form.</p> : null}
        
      </div>
    </div>
  );
}

export default SignUp;
