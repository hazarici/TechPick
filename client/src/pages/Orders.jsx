import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';

function Orders() {
  const { token } = useContext(UserContext); // Access user token from context
  const [orders, setOrders] = useState([]); // State to store user's orders
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    if (!token) return; // Exit if user is not logged in

    // Fetch user's orders from API
    fetch('http://localhost:5000/api/orders', {
      headers: {
        Authorization: `Bearer ${token}` // Send token in Authorization header
      }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []); // Store orders or empty array
        setLoading(false); // Set loading to false after fetch
      })
      .catch(() => setLoading(false)); // Handle fetch errors
  }, [token]);

  if (!token) return <p>Please login to see your orders.</p>; // Prompt login if no token
  if (loading) return <p>Loading orders...</p>; // Show loading message
  if (orders.length === 0) return <p>No orders found.</p>; // Show message if no orders

  return (
    <div>
      <h2>Your Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            <p>Order ID: {order.id}</p>
            <p>Total: €{order.total}</p>
            <p>Items:</p>
            <ul>
              {order.items.map(item => (
                <li key={item.productId}>{item.name} x {item.quantity}</li> // List each item in the order
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
