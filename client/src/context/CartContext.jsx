import React, { createContext, useState } from "react";

// Create a context to hold cart-related data and functions
export const CartContext = createContext();

// CartProvider component wraps the app to provide cart state and functions
export function CartProvider({ children }) {
  // State to store all items in the cart
  const [cartItems, setCartItems] = useState([]);

  // Function to add a product to the cart
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if the product is already in the cart
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        // If exists, increase quantity by 1
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If not, add it with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Function to increase quantity of a specific cart item
  const increaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Function to decrease quantity of a specific cart item
  const decreaseQuantity = (id) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0) // Remove items with 0 quantity
    );
  };

  // Function to remove a product entirely from the cart
  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Function to handle checkout
  const checkout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!"); // Prevent checkout if cart is empty
      return;
    }

    const token = localStorage.getItem("token"); // Get user token
    if (!token) {
      alert("You need to login first."); // Require login to checkout
      return;
    }

    // Prepare order data to send to backend
    const items = cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name
    }));

    // Calculate total price
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      // Send order to backend API
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ items, total })
      });

      if (!response.ok) {
        // If backend returns an error, show message
        const errorData = await response.json();
        alert("Order failed: " + (errorData.message || response.statusText));
        return;
      }

      const data = await response.json();
      alert("Order successful! Order ID: " + data.order.id);
      setCartItems([]); // Clear cart after successful checkout
    } catch (error) {
      alert("Error placing order: " + error.message); // Handle network errors
    }
  };

  // Provide cart state and functions to child components
  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
}
