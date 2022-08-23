import React, { useState } from 'react';
import { useUserAuth } from '../context/UserAuthContext';

function SignUp() {
  // deconstructing the useUserAuth context to only get what we need (functions to sign up)
  const { signUp } = useUserAuth();

  // states to manage user input
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // Sign up as new user
  const handleSubmit = async (e) => {
    e.preventDefault();

    // reset error
    setError('');

    // try catch sign up
    try {
      await signUp(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signUpContainer">
      <h1>Sign Up</h1>
      {/* TO DO: customize the message passed to the error modal */}
      {/* {error ? <ErrorModal errorMsg={error}/> : null} */}
      <form className="signUpForm">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" onChange={handleEmail} value={email} />
        <label htmlFor="password">Password</label>
        <input type="password" id="email" onChange={handlePassword} value={password} />
        <button type="submit" onClick={(e) => handleSubmit(e)}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
