import React, { createContext, useState, useEffect } from 'react';

// Create a context to hold user-related data and functions
export const UserContext = createContext();

// UserProvider component wraps the app to provide user state and functions
export function UserProvider({ children }) {
  // State to store current user info (null if not logged in)
  const [user, setUser] = useState(null);
  // State to store JWT token; initialize from localStorage if available
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Sync token with localStorage whenever it changes
  useEffect(() => {
    if (token) {
      // If token exists, save it to localStorage
      localStorage.setItem('token', token);
    } else {
      // If token is removed (logout), clear localStorage and reset user
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  // Function to log in the user by setting a new token
  const login = (newToken) => {
    setToken(newToken);
    // Optionally, you could fetch user info here after login
  };

  // Function to log out the user
  const logout = () => {
    setToken(null); // Remove token (triggers useEffect to clear localStorage)
    setUser(null);  // Clear user info
  };

  // Provide user state and auth functions to child components
  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
