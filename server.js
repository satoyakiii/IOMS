// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const { connectDB, closeDB } = require('./database/db');
const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Middleware =====
// Parse JSON and URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// JSON parse error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    if (req.path.startsWith('/api/')) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    return res.status(400).send('Invalid JSON');
  }
  next();
});

// Custom logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl}`);
  next();
});

// ===== API Routes =====
app.use('/api/products', productsRouter);
// ===== Static files (MUST be before HTML routes) =====
app.use(express.static(path.join(__dirname, 'public')));
// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    project: 'Inventory and Order Management System',
    assignment: 'Assignment 3 – Part 1',
    description: 'CRUD API with MongoDB',
    database: 'MongoDB (Native Driver)',
    team: ['Kuanyshbek Aisana', 'Rakhmanova Assem']
  });
});

// ===== HTML Routes =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).send('All fields are required');
  }

  const msg = {
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  };

  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const messagesFile = path.join(dataDir, 'messages.json');
  let messages = [];
  if (fs.existsSync(messagesFile)) {
    try {
      messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8') || '[]');
    } catch (e) {
      messages = [];
    }
  }
  messages.push(msg);
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');

  res.sendFile(path.join(__dirname, 'views', 'contact.html'));
});

app.get('/search', (req, res) => {
  if (!req.query.q) return res.status(400).send('Query parameter q is required');
  res.sendFile(path.join(__dirname, 'views', 'search.html'));
});

app.get('/item/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'item.html'));
});

// ===== Static files =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== 404 Handler =====
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (req.path.startsWith('/api/')) {
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
    res.status(500).send('Internal Server Error');
  }
});

// ===== Start Server =====
async function startServer() {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Then start Express server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log('\n📋 CRUD API Endpoints:');
      console.log('  GET    /api/products');
      console.log('  GET    /api/products/:id');
      console.log('  POST   /api/products');
      console.log('  PUT    /api/products/:id');
      console.log('  DELETE /api/products/:id');
      console.log('\n📚 Query Examples:');
      console.log('  Filtering:  /api/products?name=laptop&minPrice=500');
      console.log('  Sorting:    /api/products?sortBy=price&order=desc');
      console.log('  Projection: /api/products?fields=name,price');
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  await closeDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  await closeDB();
  process.exit(0);
});

startServer();