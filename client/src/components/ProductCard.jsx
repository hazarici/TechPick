
import './ProductCard.css';

export default function ProductCard({ product, onAddToCart }) {
  // Destructure product object to get individual properties
  const { name, price, category, image } = product;

  return (
    <div className="product-card">
      {/* Product image container */}
      <div className="product-image">
        {image ? (
          // Display the image if available
          <img 
            src={image} 
            alt={name} // Accessibility: alt text
            style={{ width: "100%", height: "100%", objectFit:"scale-down" }} // Ensures image fits nicely
          />
        ) : (
          // Fallback icon if no image is provided
          "🖥️"
        )}
      </div>

      {/* Product name */}
      <h3>{name}</h3>
      
      {/* Product category */}
      <p className="muted">{category}</p>

      {/* Bottom section: price and add-to-cart button */}
      <div className="card-bottom">
        {/* Price formatted to 2 decimal places */}
        <div className="price">€{price.toFixed(2)}</div>

        {/* Add to cart button */}
        <button className="add-btn" onClick={onAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
