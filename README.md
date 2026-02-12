```md
#IOMS — Inventory & Order Management System

A production-ready web application built with *Node.js, Express, and MongoDB* for managing products and customer orders with session-based authentication and role-based authorization.

This project was developed for Assignment 4 (Sessions & Security) and the Final Project (Production Web Application).

---

## Features

-  Session-based authentication (login / register / logout)
-  Role-based access control (User / Admin)
-  Product management (Admin only)
-  Order creation and tracking (Users)
-  Protected API endpoints
-  Password hashing with bcrypt
-  Secure session cookies (HttpOnly, Secure in production)
-  MongoDB database with related collections
-  Web UI (no Postman required for demo)

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Native Driver)
- express-session
- connect-mongo
- bcrypt
- Vanilla HTML/CSS/JavaScript

---

##  Project Structure

.
├─ database/
│  └─ db.js                 #MongoDB connection helper
├─ middleware/
│  └─ auth.js               #requireAuth, requireAdmin, requireOwnerOrAdmin
├─ routes/
│  ├─ auth.js               #/api/auth (register, login, logout, me)
│  ├─ products.js           #/api/products
│  └─ orders.js             #/api/orders
├─ public/
│  ├─ app.js                #frontend logic for products, auth, orders
│  ├─ auth.js               #frontend auth helpers for navbar
│  └─ style.css
├─ scripts/
│  └─ create-admins.js      #convenience script to create admin accounts
├─ views/
│  ├─ index.html
│  ├─ login.html
│  ├─ register.html
│  ├─ orders.html
│  ├─ about.html
│  ├─ contact.html
│  └─ 404.html
├─ server.js
├─ package.json
└─ README.md


---

##  Installation (Local Setup)

Quick start (local)

Clone the repo (or make sure your VS Code project has the code).

Install dependencies:

npm install


Create a .env file in the project root (see next section).

Run the app:

npm start


Open your browser: http://localhost:3000 (or http://localhost:${PORT} if you set PORT env).

##  Environment Variables

| Variable       | Required | Description                     |
| -------------- | -------- | ------------------------------- |
| MONGODB_URI    | +        | MongoDB Atlas connection string |
| SESSION_SECRET | +        | Secret key for sessions         |
| PORT           | -        | Server port                     |
| NODE_ENV       | -        | production or development       |

---

## Roles & Authorization

### User

* Can register and login
* Can create orders
* Can view only their own orders
* Cannot modify products

### Admin

* Can create, update, delete products
* Can view all orders
* Can change order status
* Has extended permissions via middleware

Authorization is implemented using custom middleware:

* `requireAuth`
* `requireAdmin`
* `requireOwnerOrAdmin`

---

## API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/logout`
* `GET /api/auth/me`

### Products

* `GET /api/products`
* `GET /api/products/:id`
* `POST /api/products` (Admin)
* `PUT /api/products/:id` (Admin)
* `DELETE /api/products/:id` (Admin)

### Orders

* `GET /api/orders`
* `POST /api/orders`
* `PATCH /api/orders/:id/status` (Admin)
* `DELETE /api/orders/:id`

---

##  Database Design

### Collections

#### users

* _id
* name
* email
* password (hashed)
* role
* createdAt

#### products

* _id
* name
* price
* quantity
* createdAt
* updatedAt

#### orders

* _id
* userId (reference)
* productId (reference)
* quantity
* totalPrice
* status
* deliveryAddress
* createdAt

Relationships:

* Orders reference both users and products.
* Users can only access their own orders.
* Admin can access all records.

---

##  Security Implementation

* Passwords hashed using bcrypt
* Sessions stored in MongoDB (connect-mongo)
* HttpOnly cookies
* Secure cookies in production
* Role-based route protection
* Input validation
* Proper HTTP status codes
* Safe error responses

Recommended improvements:

* Add CSRF protection
* Add rate limiting for login
* Add Helmet for HTTP headers
* Add pagination for products

---


##  Requirements Covered

* ✔ Session-based authentication
* ✔ Role-based authorization
* ✔ Protected write endpoints
* ✔ MongoDB with related collections
* ✔ Web UI with full CRUD
* ✔ Password hashing with bcrypt
* ✔ Environment variables for secrets
* ✔ Public deployment

---

##  Authors

* Kuanyshbek Aisana
* Rakhmanova Assem

Web Technologies 2 | Daniyar Amantayev
SE-2428
