// src/SignIn.js

import React, { useState } from 'react';
import { auth } from './firebase';  // Import auth from firebase.js
import { signInWithEmailAndPassword } from 'firebase/auth';  // Firebase method to sign in

const SignIn = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // State to hold error message

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSignIn(true);  // Notify parent component that user has signed in
      setErrorMessage('');  // Clear any previous error message
    } catch (error) {
      setErrorMessage(error.message);  // Set error message if sign-in fails
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}  {/* Show error message */}
    </div>
  );
};

export default SignIn;
