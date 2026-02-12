
require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { connectDB, closeDB } = require('./database/db');
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const session = require('express-session');
const MongoStore = require('connect-mongo');

const mongoUrl = process.env.MONGODB_URI || process.env.MONGO_URI || null;

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  store: mongoUrl ? MongoStore.create({ mongoUrl, collectionName: 'sessions' }) : undefined,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    if (req.path.startsWith('/api/')) {
      return res.status(400).json({ error: 'Invalid JSON' });
    }
    return res.status(400).send('Invalid JSON');
  }
  next();
});


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});


app.use('/api/products', productsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);


app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/info', (req, res) => {
  res.json({
    project: 'Inventory and Order Management System',
    assignment: 'Assignment 3 – Part 1',
    description: 'CRUD API with MongoDB',
    database: 'MongoDB (Native Driver)',
    team: ['Kuanyshbek Aisana', 'Rakhmanova Assem']
  });
});


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'views', 'about.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'views', 'contact.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')));
app.get('/orders', (req, res) => res.sendFile(path.join(__dirname, 'views', 'orders.html')));
app.get('/item/:id', (req, res) => res.sendFile(path.join(__dirname, 'views', 'item.html')));


app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (req.path && req.path.startsWith('/api/')) {
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
    res.status(500).send('Internal Server Error');
  }
});


process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await closeDB();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await closeDB();
  process.exit(0);
});


async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}
startServer();
