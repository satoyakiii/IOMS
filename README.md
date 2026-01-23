# Inventory and Order Management System (IOMS)

Backend API with MongoDB for managing products, inventory, and orders.

## Team
- **Kuanyshbek Aisana** - SE-2428
- **Rakhmanova Assem** - SE-2428

## Assignment
Assignment 3 - Part 1: Backend API with MongoDB (CRUD)

---

## Database

**Database Type:** MongoDB  
**Database Name:** `ioms_db`  
**Collection:** `products`

### Document Structure

```json
{
  "_id": ObjectId("..."),
  "name": "Laptop",
  "price": 999.99,
  "quantity": 15,
  "createdAt": ISODate("2024-01-15T10:30:00Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00Z")
}
```

---

## API Routes

Base URL: `http://localhost:3000`

### CRUD Operations

| Method | Endpoint             | Description              | Success Status |
|--------|----------------------|--------------------------|----------------|
| GET    | `/api/products`      | Get all products         | 200 OK         |
| GET    | `/api/products/:id`  | Get product by ID        | 200 OK         |
| POST   | `/api/products`      | Create new product       | 201 Created    |
| PUT    | `/api/products/:id`  | Update product           | 200 OK         |
| DELETE | `/api/products/:id`  | Delete product           | 200 OK         |

### Query Parameters (GET /api/products)

#### Filtering
- `?name=laptop` - Search by name (case-insensitive)
- `?minPrice=500` - Minimum price filter
- `?maxPrice=2000` - Maximum price filter

#### Sorting
- `?sortBy=price` - Sort by field (name, price, quantity)
- `?order=desc` - Sort order (asc or desc)

#### Projection
- `?fields=name,price` - Return only specified fields

#### Examples
```
GET /api/products?name=laptop&minPrice=500&maxPrice=2000
GET /api/products?sortBy=price&order=desc
GET /api/products?fields=name,price&sortBy=name
GET /api/products?name=gaming&sortBy=price&order=asc&fields=name,price,quantity
```

---

## Response Examples

**GET /api/products**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Laptop",
    "price": 999.99,
    "quantity": 15,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Mouse",
    "price": 25.50,
    "quantity": 50,
    "createdAt": "2024-01-15T10:31:00.000Z",
    "updatedAt": "2024-01-15T10:31:00.000Z"
  }
]
```

**POST /api/products**
```json
Request Body:
{
  "name": "Keyboard",
  "price": 75.00,
  "quantity": 30
}

Response (201 Created):
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Keyboard",
  "price": 75.00,
  "quantity": 30,
  "createdAt": "2024-01-15T10:35:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

---

## Error Responses

| Status | Description | Example |
|--------|-------------|---------|
| 400 | Invalid ID | `{ "error": "Invalid id" }` |
| 400 | Invalid fields | `{ "error": "Invalid or missing field: name" }` |
| 404 | Not found | `{ "error": "Product not found" }` |
| 500 | Server error | `{ "error": "Database error" }` |

---

## Installation & Setup

### Prerequisites
- **Node.js** v14+ - [Download](https://nodejs.org)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community)

### MongoDB Installation

**Option 1: Local MongoDB**
1. Install MongoDB Community Server
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

**Option 2: MongoDB Atlas (Cloud)**
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster and get connection string
3. Set environment variable:
   ```bash
   export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/"
   ```

### Project Setup

1. **Extract project files**

2. **Navigate to project folder:**
   ```bash
   cd path/to/IOMS
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Open browser:**
   ```
   http://localhost:3000
   ```

---

## Project Structure

```
IOMS/
├── server.js              # Main server file
├── package.json           # Dependencies
├── README.md              # Documentation
├── database/
│   └── db.js              # MongoDB connection
├── routes/
│   └── products.js        # Product API routes
├── public/
│   └── style.css          # Static CSS
├── views/
│   ├── index.html         # Home page
│   ├── about.html         # About page
│   ├── contact.html       # Contact page
│   └── 404.html           # Error page
└── data/
    └── messages.json      # Contact form submissions
```

---

## Testing the API

### Using cURL

**Get all products:**
```bash
curl http://localhost:3000/api/products
```

**Filter and sort:**
```bash
curl "http://localhost:3000/api/products?name=laptop&sortBy=price&order=desc"
```

**Get single product:**
```bash
curl http://localhost:3000/api/products/507f1f77bcf86cd799439011
```

**Create product:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Gaming Laptop","price":1299.99,"quantity":10}'
```

**Update product:**
```bash
curl -X PUT http://localhost:3000/api/products/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Laptop","price":1099.99,"quantity":8}'
```

**Delete product:**
```bash
curl -X DELETE http://localhost:3000/api/products/507f1f77bcf86cd799439011
```

### Using MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Navigate to `ioms_db` → `products` collection
4. View/edit documents directly

---

## Technologies

- **Node.js** - JavaScript runtime
- **Express.js 5.x** - Web framework
- **MongoDB 6.x** - NoSQL database
- **MongoDB Native Driver** - Official Node.js driver

---

## Features Implemented

✅ MongoDB native driver (no Mongoose)  
✅ Complete CRUD operations  
✅ Filtering by name and price range  
✅ Sorting by any field (asc/desc)  
✅ Field projection  
✅ Input validation  
✅ Proper HTTP status codes (200, 201, 400, 404, 500)  
✅ Custom logger middleware  
✅ Modular folder structure (routes/, database/)  
✅ Graceful shutdown  
✅ ObjectId validation  

---

## Environment Variables

```bash
# Optional: Set MongoDB connection string
export MONGODB_URI="mongodb://localhost:27017"

# Optional: Set port
export PORT=3000
```

---

## License

ISC

---

## Assignment 3 – Part 2: Deployment and Production Web Application

### 🌐 Deployed Application

**Production URL:** `https://your-app.onrender.com` *(будет обновлено после деплоя)*

### 🚀 Deployment Information

This application is deployed on **Render** (or Railway/Heroku) and includes:
- Full-stack web application with Express backend
- MongoDB database integration
- Web interface for CRUD operations
- Environment variables configured in production

### 📋 Environment Variables Required

The following environment variables must be set in the hosting platform:

- `MONGO_URI` - MongoDB connection string (required)
- `PORT` - Server port (automatically set by hosting platform)

**Local development:** Create a `.env` file in the root directory:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
PORT=3000
```

**⚠️ Important:** Never commit `.env` file to GitHub. It's included in `.gitignore`.

### 🔧 Local Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd IOMS
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your MongoDB URI:
```bash
echo "MONGO_URI=your_mongodb_connection_string" > .env
```

4. Start the server:
```bash
npm start
```

5. Open browser at `http://localhost:3000`

### 🛠️ Production Deployment Steps

#### Option 1: Deploy to Render

1. Push code to GitHub repository
2. Go to [render.com](https://render.com) and create new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add Environment Variable:
   - Key: `MONGO_URI`
   - Value: Your MongoDB connection string
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)

#### Option 2: Deploy to Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project from GitHub repo
4. Add Environment Variable `MONGO_URI`
5. Railway automatically detects Node.js and deploys

#### Option 3: Deploy to Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set env: `heroku config:set MONGO_URI=your_connection_string`
5. Deploy: `git push heroku main`

### ✅ Features Implemented (Part 2)

- ✅ **Production Deployment:** Application accessible via public URL
- ✅ **Environment Variables:** Proper use of `MONGO_URI` and `PORT`
- ✅ **Web Interface:** Full CRUD operations through UI
- ✅ **CREATE:** Add new products via form
- ✅ **READ:** Display all products in table
- ✅ **UPDATE:** Edit existing products
- ✅ **DELETE:** Remove products with confirmation
- ✅ **Dynamic Data:** All operations use backend API (no Postman needed)
- ✅ **GitHub Repository:** Clean commit history, .gitignore, README
- ✅ **Stable Production:** Error handling and validation

### 🎯 Acceptance Criteria Met

- [x] Public URL opens web interface at `/`
- [x] Server uses `process.env.PORT`
- [x] MongoDB connection works in production via `MONGO_URI`
- [x] All CRUD operations work through web UI
- [x] `.env` not in repository (included in `.gitignore`)
- [x] README contains instructions and deployed URL
- [x] Application stable in production environment

### 📝 Testing the Application

**Local Testing:**
1. Start server: `npm start`
2. Open: `http://localhost:3000`
3. Test CRUD: Add → Edit → Delete products
4. Check DevTools Network tab for API calls

**Production Testing:**
1. Open deployed URL
2. Verify products load from MongoDB
3. Test all CRUD operations through UI
4. Confirm data persists after page reload

### 🐛 Troubleshooting

**Connection Error:**
- Verify `MONGO_URI` is set correctly
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0)
- Ensure database user has read/write permissions

**Port Error:**
- Hosting platforms set `PORT` automatically
- Don't hardcode port in server.js

**Static Files Not Loading:**
- Verify `app.use(express.static('public'))` is before routes
- Check file paths are case-sensitive

### 📚 API Documentation

All API endpoints remain functional:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### 👥 Team

- **Kuanyshbek Aisana** - SE-2428
- **Rakhmanova Assem** - SE-2428

### 📄 License

ISC