import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

function Login() {
  const { login } = useContext(UserContext); // Access login function from UserContext
  const [email, setEmail] = useState(''); // State to store email input
  const [password, setPassword] = useState(''); // State to store password input
  const [error, setError] = useState(null); // State to store any login error

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      // Send POST request to login API
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Handle failed response
      if (!res.ok) {
        const err = await res.json();
        setError(err.message || 'Login failed'); // Show error message
        return;
      }

      const data = await res.json(); // Parse successful response
      login(data.token); // Call login function from context with token
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message); // Handle fetch/network errors
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{color: 'red'}}>{error}</p>} {/* Display error if exists */}
      <form onSubmit={handleSubmit}>
        {/* Email input field */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {/* Password input field */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button> {/* Submit button */}
      </form>
    </div>
  );
}

export default Login;
