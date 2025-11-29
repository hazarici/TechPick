import React, { useEffect, useState, useContext } from 'react';
import './ReadySystems.css';
import { CartContext } from '../context/CartContext';

function ReadySystems() {
  const [systems, setSystems] = useState([]); // Store all ready systems
  const [sortOrder, setSortOrder] = useState(""); // Store current sort order
  const [minPrice, setMinPrice] = useState(""); // Store minimum price filter
  const [maxPrice, setMaxPrice] = useState(""); // Store maximum price filter
  const { addToCart } = useContext(CartContext); // Access addToCart function from context

  useEffect(() => {
    // Fetch all products from API
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        // Filter only products in "ReadySystems" category
        const readySystemsItems = data.filter(item => item.category === "ReadySystems");
        setSystems(readySystemsItems);
      })
      .catch(err => console.error('Error fetching ready systems:', err));
  }, []);

  // Filter systems based on price range
  const filteredSystems = systems.filter((system) => {
    const meetsMin = minPrice ? system.price >= parseFloat(minPrice) : true;
    const meetsMax = maxPrice ? system.price <= parseFloat(maxPrice) : true;
    return meetsMin && meetsMax;
  });

  // Sort systems based on selected sort order
  const sortedSystems = [...filteredSystems].sort((a, b) => {
    if (sortOrder === "lowToHigh") return a.price - b.price;
    if (sortOrder === "highToLow") return b.price - a.price;
    return 0;
  });

  return (
    <div className="page-container ready-systems">
      <h2 className="page-title">Ready Systems</h2>

      {/* Filter and sort controls */}
      <div className="filter-controls" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        
        {/* Min price input */}
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        {/* Max price input */}
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        {/* Sorting select */}
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Default</option>
          <option value="lowToHigh">Low to high</option>
          <option value="highToLow">High to low</option>
        </select>
      </div>

      {/* Product list */}
      <div className="system-list">
        {sortedSystems.length > 0 ? (
          sortedSystems.map(system => (
            <div key={system.id} className="system-card">
              {/* Product image */}
              <img
                src={system.image}
                alt={system.name}
                className="system-img"
              />
              {/* Product name with icon */}
              <h3 className="system-name">{system.icon} {system.name}</h3>
              {/* Product description */}
              <p className="description">{system.description}</p>
              {/* Product price */}
              <p className="price">€{system.price.toFixed(2)}</p>
              {/* Add to cart button */}
              <button onClick={() => addToCart(system)} className="add-btn">
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p>No systems found in this price range.</p> // Message if no products match filter
        )}
      </div>
    </div>
  );
}

export default ReadySystems;
