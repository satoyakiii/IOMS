# Inventory and Order Management System (IOMS)

This project is a backend system for managing products, inventory levels, and customer orders for a small business.

The system is designed to keep track of available products, control stock quantities across warehouses, and handle the order creation process. Routine operations such as updating inventory and creating orders are handled automatically by the system, while administrative actions remain under admin control.

## Team
**Kuanyshbek Aisana** and **Rakhmanova Assem**, SE-2428

## Topic Explanation
The topic of this project is inventory and order management for a small business. The system is designed to store information about products, track inventory levels across warehouses, and handle customer orders.

The main goal of the project is to model real-world business processes such as stock control, order creation, and administrative management, focusing on backend functionality rather than frontend features.

## Users and Roles
The system supports two user roles:
- **Admin** – manages products, inventory, warehouses, orders, and returns
- **Customer** – browses products, creates orders, and requests returns

## Core Functionality
- Product management (create, update, delete products)
- Inventory tracking across warehouses
- Order creation and processing
- Automatic inventory updates when orders are created
- Order status management
- Order return handling
- Administrative control over system data

## Technologies
- Node.js
- Express.js
- PostgreSQL (planned)
- MongoDB (planned)

---

## Available Routes

### GET Routes
- **`GET /`** – Home page with project overview and system features
- **`GET /about`** – Information about the team, mission, and technology stack
- **`GET /contact`** – Contact form page
- **`GET /search?q=value1`**
- **`GET /item/:id`**
- **`GET /api/info`**


### POST Routes
- **`POST /contact`** – Handles contact form submission
  - **Request body:** `name`, `email`, `message`
  - **Response:** Success page with confirmation message
  - **Bonus:** Saves submitted messages to `data/messages.json`

### Error Handling
- **`404`** – Custom 404 page for undefined routes

---

## Installation & Run Instructions

### Prerequisites
Make sure **Node.js** is installed on your system. Check by running:
```bash
node -v
```

If Node.js is not installed, download it from: https://nodejs.org

### Setup Steps

1. **Download or clone the project:**
   ```bash
   git clone <repository-url>
   cd IOMS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   Or:
   ```bash
   node server.js
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

---

## Testing Instructions

### Manual Testing

#### 1. Test Home Page (GET /)
- Navigate to `http://localhost:3000/`
- Verify the page displays project overview and navigation
- Click navigation links to test routing

#### 2. Test About Page (GET /about)
- Navigate to `http://localhost:3000/about`
- Verify team information and project details are displayed

#### 3. Test Contact Form (GET /contact and POST /contact)
- Navigate to `http://localhost:3000/contact`
- Fill in the form with:
  - **Name:** Your name
  - **Email:** your.email@example.com
  - **Message:** Test message
- Click "Send Message"
- Verify:
  - Console shows `req.body` with form data
  - Success page displays with your name
  - File `data/messages.json` is created with the message (Bonus feature)

#### 4. Test 404 Page
- Navigate to a non-existent route: `http://localhost:3000/nonexistent`
- Verify custom 404 page is displayed
- Check that HTTP status code is 404 (use browser DevTools Network tab)

### Testing with Postman (Optional)

**POST /contact:**
```
POST http://localhost:3000/contact
Content-Type: application/x-www-form-urlencoded

name=Асем&email=242472@astanait.edu.kz&message=jn
```

---

## Project Structure

```
IOMS/
├── server.js           # Main Express server with routes
├── package.json        # Project dependencies
├── README.md           # Project documentation
├── public/
│   └── style.css       # Stylesheet for all pages
├── views/
│   ├── index.html      # Home page
│   ├── about.html      # About page
│   ├── contact.html    # Contact form page
│   └── 404.html        # Error page
└── data/
    └── messages.json   # Stored contact messages (created automatically)
```

---

## Assignment Progress

### ✅ Part 1: Basic Setup
- Express.js server setup
- Static file serving
- Landing page with project information

### ✅ Part 2: Routing and Forms (Current)
- GET routes: `/`, `/about`, `/contact`
- POST route: `/contact` with form handling
- Form data processing using `express.urlencoded()`
- 404 error page with middleware
- Consistent navigation across all pages
- **Bonus:** Form data saved to JSON file

### 🔄 Upcoming Parts
- Part 3: API expansion and request/response handling
- Parts 4-10: Database integration, deployment, authentication, etc.

---

## Project Roadmap

**Week 1** ✅  
Project setup with Express.js. Basic server configuration, landing page, and README.

**Week 2** ✅  
Backend project structure (routes and controllers). Handling forms and POST requests without a database.

**Week 3**  
API expansion and request/response handling. Initial server-side logic for cart and orders.

**Week 4**  
Data structure design. Order and inventory logic preparation before database integration.

**Week 5**  
SQL database integration (PostgreSQL). Creating tables for users, products, warehouses, and orders.

**Week 6**  
NoSQL database integration (MongoDB). Implementing action logging and storing auxiliary data.

**Week 7**  
Backend deployment. Environment variable configuration and online server testing.

**Week 8**  
RESTful API completion. Adding PUT, PATCH, and DELETE methods.

**Week 9**  
Authentication and authorization implementation. Role-based access control.

**Week 10**  
Project finalization. Testing, debugging, and preparation for final demonstration.

---

## Design Improvements (Part 2)

The application features a modern, clean design with:
- **CSS Variables:** Consistent colors, typography, and spacing
- **Card-based Layout:** Sections with subtle shadows and hover effects
- **Responsive Design:** Mobile-friendly navigation and layout
- **Accessible Forms:** Proper labels, focus states, and validation
- **Smooth Transitions:** Hover effects on buttons, links, and cards

---

## License
ISC

## Contact
For questions or feedback, use the contact form at `/contact` or reach out to the team members.


## Assignment 2 – Part 1: Server-side Request Handling

In this part of the project, we extended the backend of the system to demonstrate **server-side request handling** using Express.js.  
The focus of this assignment is not on real data or database logic, but on understanding how a server processes different types of requests.

---

## Implemented Features

- Express.js server setup
- Server-side routing using GET and POST methods
- Handling **query parameters** using `/search?q=value`
- Handling **route parameters** using `/item/:id`
- Processing form submissions with POST `/contact`
- Server-side validation with proper HTTP status codes (400)
- Custom logger middleware that logs HTTP method and URL
- Saving submitted contact form data into a JSON file
- JSON API endpoint `/api/info`
- Custom 404 page for unknown routes
- Consistent navigation across all pages

---

## Routes Overview

| Method | Route | Description |
|------|------|------------|
| GET | `/` | Home page |
| GET | `/about` | About page |
| GET | `/contact` | Contact form |
| POST | `/contact` | Handle contact form submission |
| GET | `/search?q=value` | Search placeholder using query parameter |
| GET | `/item/:id` | Item placeholder using route parameter |
| GET | `/api/info` | JSON API endpoint with project information |

---

## Validation

- Missing query parameter `q` in `/search` returns **HTTP 400**
- Missing required form fields in `/contact` returns **HTTP 400**
- Validation is handled on the server side

---

## API Endpoint

The `/api/info` endpoint returns project information in JSON format and represents a placeholder API for future frontend or mobile integrations.

Example response:

```json
{
  "project": "Inventory and Order Management System",
  "assignment": "Assignment 2 – Part 1",
  "description": "Backend placeholders for warehouse and order management"
}