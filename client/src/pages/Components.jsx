import React, { useEffect, useState, useContext } from "react";
import ProductCard from "../components/ProductCard";
import './Components.css';
import { CartContext } from "../context/CartContext";

/**
 * Components Page
 * Displays individual computer components, allows filtering, sorting, and adding items to the cart.
 *
 * Features:
 * - Fetch products from API
 * - Filter by category and price
 * - Sort by price
 * - Add products to cart
 */
function Components() {
  // State variables
  const [componentsData, setComponentsData] = useState([]); // All products fetched from API
  const [selectedCategories, setSelectedCategories] = useState([]); // Selected categories
  const [sortOrder, setSortOrder] = useState(""); // Sorting order (asc/desc)
  const [minPrice, setMinPrice] = useState(""); // Minimum price filter
  const [maxPrice, setMaxPrice] = useState(""); // Maximum price filter

  const { addToCart } = useContext(CartContext); // Function to add items to cart
  const categories = ["CPU", "GPU", "RAM", "Motherboard", "SSD", "PSU", "Case", "Monitor", "Keyboard", "Mouse"];

  // Fetch products from API on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setComponentsData(data))
      .catch(err => console.error("API fetch error:", err));
  }, []);

  // Add product to cart
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // Handle category selection changes
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category) // Remove if already selected
        : [...prev, category] // Add if not selected
    );
  };

  // Handle sort order change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Apply filtering
  let filteredProducts = componentsData
    .filter(item => item.category !== "ReadySystems") // Exclude ReadySystems
    .filter(item =>
      selectedCategories.length > 0 ? selectedCategories.includes(item.category) : true
    )
    .filter(item =>
      minPrice !== "" ? item.price >= parseFloat(minPrice) : true
    )
    .filter(item =>
      maxPrice !== "" ? item.price <= parseFloat(maxPrice) : true
    );

  // Apply sorting
  if (sortOrder === "asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="page-container components-page">
      <h2 className="page-title">Components</h2>

      <div className="filters">
        {/* Category Filters */}
        <div className="category-filters">
          {categories.map(cat => (
            <label key={cat} style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                value={cat}
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
              />
              {cat}
            </label>
          ))}
        </div>

        {/* Price and Sort Wrapper */}
        <div className="price-sort-wrapper">
          <div className="price-filters">
            <label>
              Min:{" "}
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                style={{ width: "80px" }}
              />
            </label>
            <label>
              Max:{" "}
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="10000"
                style={{ width: "80px" }}
              />
            </label>
          </div>
          <div className="sort-filter">
            <label>
              Price:{" "}
              <select value={sortOrder} onChange={handleSortChange}>
                <option value="">Default</option>
                <option value="asc">Low to high</option>
                <option value="desc">High to low</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="product-list" style={{ marginTop: "20px" }}>
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={() => handleAddToCart(product)}
          />
        ))}
      </div>
    </div>
  );
}

export default Components;
