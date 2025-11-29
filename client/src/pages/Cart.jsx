import React, { useContext } from "react";
import './Cart.css';
import { CartContext } from "../context/CartContext";

/* Cart component
   Displays the shopping cart with all added items.
   Allows users to increase/decrease quantity, remove items, and checkout.
   Uses CartContext to access cart state and actions.
*/

function Cart() {
  // Use CartContext to access cart state and actions
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, checkout } = useContext(CartContext);

  // Calculate total price of all items in cart
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        /* Display message if cart is empty */
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {/* Map through cart items and render each */}
          {cartItems.map(({ id, name, price, quantity }) => (
            <div key={id} className="cart-item">
              
              {/* Item information: name and price */}
              <div className="item-info">
                <h4>{name}</h4>
                <p>Price: €{price}</p>
              </div>

              {/* Controls for adjusting quantity */}
              <div className="item-controls">
                <button onClick={() => decreaseQuantity(id)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => increaseQuantity(id)}>+</button>
              </div>

              {/* Button to remove item completely from cart */}
              <div className="item-remove">
                <button onClick={() => removeFromCart(id)}>Remove</button>
              </div>
            </div>
          ))}

          {/* Total price and checkout button */}
          <div className="cart-total">
            <h3>Total: €{totalPrice.toFixed(2)}</h3>
            <button 
              className="checkout-btn" 
              onClick={checkout} 
              disabled={cartItems.length === 0} // Disable if cart is empty
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
