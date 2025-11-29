// App.js
// Main application component for TechPick.
// This component sets up the application's routing, layout, and global state providers.
// Providers: AuthProvider (user authentication), UserProvider (user data), CartProvider (shopping cart state).
// Routes: ReadySystems, Components, Cart, User
// Uses React Router for navigation.

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import ReadySystems from './pages/ReadySystems';
import Components from './pages/Components';
import Cart from './pages/Cart';
import User from './pages/User';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext'; 
import { UserProvider } from './context/UserContext';

function App() {
  return (
    // AuthProvider manages authentication state across the app
    <AuthProvider> 
      {/* UserProvider stores and provides user profile data */}
      <UserProvider>
        {/* CartProvider manages the shopping cart state */}
        <CartProvider>
          <Router>
            {/* Navbar is always displayed at the top */}
            <Navbar />
            <div style={{ padding: '20px' }}>
              <Routes>
                {/* Ready-made systems page */}
                <Route path="/ready-systems" element={<ReadySystems />} />
                {/* Individual components page */}
                <Route path="/components" element={<Components />} />
                {/* Shopping cart page */}
                <Route path="/cart" element={<Cart />} />
                {/* User account page */}
                <Route path="/user" element={<User />} />
                {/* Default route: redirect to ReadySystems */}
                <Route path="*" element={<ReadySystems />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
