import React, { useState } from 'react';

function Register() {
  // State to store form input values
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    surname: '',
    address: '',
    paymentMethod: ''
  });

  // State to store feedback messages for the user
  const [message, setMessage] = useState('');

  // Update formData state when an input changes
  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault(); // Prevent page reload

    // Send form data to backend API
    const res = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok) {
      // Registration successful
      setMessage('Registered');
      // Reset form fields
      setFormData({
        username: '',
        password: '',
        name: '',
        surname: '',
        address: '',
        paymentMethod: ''
      });
    } else {
      // Registration failed, display error message
      setMessage(data.message || 'Error');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {/* Registration form */}
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
        <button type="submit">Register</button>
      </form>

      {/* Display success or error message */}
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
