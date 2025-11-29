import React, { createContext, useState, useEffect } from 'react';

// Create a context to hold authentication-related data and functions
export const AuthContext = createContext();

// AuthProvider component will wrap the app to provide auth state
export function AuthProvider({ children }) {
  // State to store currently logged-in user
  const [user, setUser] = useState(null);
  // State to store JWT token
  const [token, setToken] = useState(null);
  // Loading state to indicate if auth info is being fetched
  const [loading, setLoading] = useState(true);

  // useEffect runs once when the component mounts
  useEffect(() => {
    // Retrieve token from localStorage if it exists
    const savedToken = localStorage.getItem('token');

    // Async function to fetch user info from backend
    async function fetchUser() {
      if (savedToken) {
        try {
          // Send request to get user data using the saved token
          const res = await fetch('http://localhost:5000/api/users/me', {
            headers: {
              'Authorization': `Bearer ${savedToken}` // Bearer token authentication
            }
          });

          if (res.ok) {
            // If response is ok, parse JSON and update state
            const userData = await res.json();
            setUser(userData); // Set user state
            setToken(savedToken); // Set token state
            // Also save user and token to localStorage
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', savedToken);
          } else {
            // If token is invalid or expired, logout the user
            logout();
          }
        } catch (error) {
          // Handle any network or fetch errors
          console.error('Error fetching user:', error);
          logout();
        }
      }
      // After fetching (or skipping if no token), set loading to false
      setLoading(false);
    }

    fetchUser(); // Call the async fetch function
  }, []); // Empty dependency array ensures this runs only once

  // Function to log in user and save token
  function login(userData, jwtToken) {
    setUser(userData); // Set user state
    setToken(jwtToken); // Set token state
    // Save user and token to localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwtToken);
  }

  // Function to log out user
  function logout() {
    setUser(null); // Clear user state
    setToken(null); // Clear token state
    // Remove user and token from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // Provide auth state and functions to child components
  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
