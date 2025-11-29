import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext to access user authentication state
import './User.css';

function User() {
  // Destructure user info and authentication functions from AuthContext
  const { user, token, login, logout } = useContext(AuthContext);

  // Form states
  const [isRegister, setIsRegister] = useState(false); // Toggle between login and register forms
  const [formData, setFormData] = useState({          // Store form input values
    username: '',
    password: '',
    name: '',
    surname: '',
    address: '',
    paymentMethod: ''
  });
  const [error, setError] = useState(''); // Store error messages for the form
  const [loading, setLoading] = useState(false); // Track form submission loading state

  // Orders state
  const [orders, setOrders] = useState([]);        // Store user's orders
  const [ordersLoading, setOrdersLoading] = useState(false); // Track order fetch loading

  // Update formData state when input fields change
  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Handle login or registration form submission
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');   // Clear previous errors
    setLoading(true); // Start loading state

    // Set API endpoint based on whether user is registering or logging in
    const url = isRegister
      ? 'http://localhost:5000/api/users/register'
      : 'http://localhost:5000/api/users/login';

    // Prepare payload for API request
    const payload = isRegister
      ? formData // Send all form data for registration
      : { username: formData.username, password: formData.password }; // Only username & password for login

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error'); // Show API error message
        setLoading(false);
        return;
      }

      if (!isRegister) {
        login(data.user, data.token); // Log in user with received token
      } else {
        setIsRegister(false); // After registration, switch to login form
      }
    } catch (err) {
      setError('Server Error'); // Handle network/server errors
    }
    setLoading(false); // End loading state
  }

  // Fetch user orders if logged in
  useEffect(() => {
    async function fetchOrders() {
      if (!token) return; // Do nothing if user is not logged in
      setOrdersLoading(true); // Start loading state

      try {
        const res = await fetch('http://localhost:5000/api/users/me/orders', {
          headers: {
            Authorization: `Bearer ${token}` // Pass auth token in header
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data); // Set user's orders
        } else {
          console.error('Orders could not be taken');
          setOrders([]);
        }
      } catch (error) {
        console.error('Error during order:', error);
        setOrders([]);
      }
      setOrdersLoading(false); // End loading state
    }

    fetchOrders();
  }, [token]); // Re-run whenever token changes

  // If user is logged in, display user info and orders
  if (user) {
    return (
      <div className="user-container">
        <h2>Welcome, {user.name || user.username}</h2>
        <p>Username: {user.username}</p>
        <p>Name: {user.name}</p>
        <p>Surname: {user.surname}</p>
        <p>Address: {user.address}</p>
        <p>Payment Method: {user.paymentMethod}</p>
        <button onClick={logout}>Log out</button>

        <h3>Orders</h3>
        {ordersLoading ? (
          <p>Loading...</p> // Show loading while fetching orders
        ) : orders.length === 0 ? (
          <p>You have no orders yet</p> // Message if no orders
        ) : (
          <ul>
            {orders.map(order => (
              <li key={order.id}>
                Order ID: {order.id} - Date: {new Date(order.date).toLocaleDateString()}
                <p>Estimated delivery within 3 days.</p>
                <ul>
                  {order.items.map(item => (
                    <li key={item.id}>
                      {item.name} x {item.quantity} - €{item.price}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // If user is not logged in, show login/register form
  return (
    <div className="user-container">
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {isRegister && ( // Show extra fields only for registration
          <>
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              name="surname"
              placeholder="Surname"
              value={formData.surname}
              onChange={handleChange}
            />
            <input
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
            <input
              name="paymentMethod"
              placeholder="Payment Method"
              value={formData.paymentMethod}
              onChange={handleChange}
            />
          </>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isRegister ? 'Register' : 'Log in'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>} {/* Display error messages */}
      <p style={{ marginTop: 10 }}>
        {isRegister ? 'You already have an account? ' : 'No account? '}
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="toggle-auth-btn"
        >
          {isRegister ? 'Log in' : 'Register'} {/* Toggle between login and register */}
        </button>
      </p>
    </div>
  );
}

export default User;
