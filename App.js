// src/App.js

import React, { useState, useEffect } from 'react';
import SignIn from './SignIn';  // Import SignIn component
import Chat from './Chat';  // Import Chat component
import { auth } from './firebase';  // Import auth from firebase.js
import { onAuthStateChanged } from 'firebase/auth';  // Firebase method to track user state

const App = () => {
  const [user, setUser] = useState(null);  // Track authenticated user
  const [loading, setLoading] = useState(true);  // Track loading state

  useEffect(() => {
    // Set up an observer to track user authentication status
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User signed in:", user);  // Debugging: log user data
        setUser(user);
      } else {
        console.log("No user signed in");  // Debugging: log if no user is signed in
        setUser(null);
      }
      setLoading(false);  // Set loading to false after auth state changes
    });

    // Clean up observer when component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p>Loading...</p>;  // Show loading state while checking auth
  }

  return (
    <div>
      {user ? (
        <Chat />  // If the user is signed in, show the Chat component
      ) : (
        <SignIn onSignIn={(status) => setUser(status ? 'user' : null)} />  // If no user is signed in, show SignIn
      )}
    </div>
  );
};

export default App;
