const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb'); // Lightweight JSON database
const { JSONFile } = require('lowdb/node');
const bcrypt = require('bcrypt'); // Password hashing
const jwt = require('jsonwebtoken'); // JSON Web Tokens for auth

const app = express();
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON bodies

const port = 5000;
const SECRET_KEY = 'your_secret_key_here'; // JWT signing key (should be in .env)

// --- Lowdb setup ---
const adapter = new JSONFile('db.json'); // JSON file storage
const defaultData = { users: [], orders: [], products: [] }; // Default structure
const db = new Low(adapter, defaultData);

// Initialize database: read existing data or set defaults
async function initDB() {
  await db.read();
  db.data ||= defaultData; // If db is empty, initialize with defaults
}
initDB();

// --- Products endpoint ---
// Returns all products from the database
app.get('/api/products', async (req, res) => {
  await db.read();
  res.json(db.data.products);
});

// --- User Registration ---
// Registers a new user with hashed password
app.post('/api/users/register', async (req, res) => {
  const { username, password, name, surname, address, paymentMethod } = req.body;

  // Validate required fields
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  await db.read();
  const userExists = db.data.users.find(u => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user object
  const newUser = {
    id: Date.now().toString(), // simple unique ID
    username,
    password: hashedPassword,
    name: name || '',
    surname: surname || '',
    address: address || '',
    paymentMethod: paymentMethod || '',
    orders: [] // keep track of order IDs
  };

  db.data.users.push(newUser); // Save user
  await db.write();

  res.status(201).json({ message: 'User registered successfully' });
});

// --- User Login ---
// Validates credentials and returns a JWT token
app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;

  await db.read();
  const user = db.data.users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Compare hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid username or password' });
  }

  // Create JWT token valid for 1 hour
  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });

  // Return token and user info (without password)
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      surname: user.surname,
      address: user.address,
      paymentMethod: user.paymentMethod
    }
  });
});

// --- Middleware: Token Authentication ---
// Protects routes that require login
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.userId = user.userId; // Attach userId to request for later use
    next();
  });
}

// Serve static images from public/images folder
app.use('/images', express.static('public/images'));

// --- Get Current User Profile ---
app.get('/api/users/me', authenticateToken, async (req, res) => {
  await db.read();
  const user = db.data.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { password, ...userData } = user; // Exclude password
  res.json(userData);
});

// --- Update Current User Profile ---
app.put('/api/users/me', authenticateToken, async (req, res) => {
  const { name, surname, address, paymentMethod } = req.body;
  await db.read();

  const userIndex = db.data.users.findIndex(u => u.id === req.userId);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  const user = db.data.users[userIndex];
  // Update only provided fields
  db.data.users[userIndex] = {
    ...user,
    name: name !== undefined ? name : user.name,
    surname: surname !== undefined ? surname : user.surname,
    address: address !== undefined ? address : user.address,
    paymentMethod: paymentMethod !== undefined ? paymentMethod : user.paymentMethod,
  };

  await db.write();
  const { password, ...updatedUser } = db.data.users[userIndex];
  res.json(updatedUser);
});

// --- Place Order ---
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { items, total } = req.body; // Items in cart + total price

  if (!items || !items.length) {
    return res.status(400).json({ message: 'Order items required' });
  }

  await db.read();
  const userIndex = db.data.users.findIndex(u => u.id === req.userId);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

  // Create order object
  const newOrder = {
    id: Date.now().toString(),
    userId: req.userId,
    items,
    total,
    date: new Date().toISOString()
  };

  db.data.orders.push(newOrder); // Save order
  db.data.users[userIndex].orders.push(newOrder.id); // Link order to user
  await db.write();

  res.status(201).json({ message: 'Order placed', order: newOrder });
});

// --- Get Current User Orders ---
app.get('/api/users/me/orders', authenticateToken, async (req, res) => {
  await db.read();
  const user = db.data.users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Filter orders for this user
  const userOrders = db.data.orders.filter(o => o.userId === req.userId);
  res.json(userOrders);
});

// --- Start server ---
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
