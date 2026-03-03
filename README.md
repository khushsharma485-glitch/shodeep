# Antigravity — Premium Ecommerce Platform

A production-ready full-stack Ecommerce application built with **Spring Boot**, **React**, and **PostgreSQL**.

![Java](https://img.shields.io/badge/Java-17-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green) ![React](https://img.shields.io/badge/React-18-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

---

## 🏗 Architecture

```
Ecom-spring/
├── backend/          # Spring Boot REST API
│   └── src/main/java/com/antigravity/
│       ├── controller/    # REST endpoints
│       ├── service/       # Business logic
│       ├── repository/    # Data access (JPA)
│       ├── model/         # Entity classes
│       ├── dto/           # Data transfer objects
│       ├── config/        # Security, CORS, Swagger
│       ├── security/      # JWT authentication
│       └── exception/     # Global error handling
├── frontend/         # React + Vite UI
│   └── src/
│       ├── components/    # Navbar, Footer, Cards
│       ├── pages/         # 8 page components
│       ├── context/       # Auth & Cart state
│       └── services/      # API client (Axios)
├── schema.sql        # Database schema
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Java 17+**
- **Node.js 18+**
- **PostgreSQL 15+**
- **Maven 3.8+**

### 1. Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE antigravity;
\q
```

Or run the schema:
```bash
psql -U postgres -d antigravity -f schema.sql
```

> **Note:** The app uses `spring.jpa.hibernate.ddl-auto=update`, so tables are auto-created on startup.

### 2. Backend

```bash
cd backend

# Build
mvn clean install -DskipTests

# Run
mvn spring-boot:run
```

The API starts at **http://localhost:8080**

- Swagger UI: http://localhost:8080/swagger-ui.html
- API Docs: http://localhost:8080/api-docs

### 3. Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The UI opens at **http://localhost:5173**

---

## 🔐 Default Credentials

| Role  | Email                  | Password   |
|-------|------------------------|------------|
| Admin | admin@antigravity.com  | admin123   |

> A new user can register via the Sign Up page (role: `USER`).

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint              | Description      | Auth |
|--------|-----------------------|------------------|------|
| POST   | `/api/auth/register`  | Register user    | ❌   |
| POST   | `/api/auth/login`     | Login + get JWT  | ❌   |

### Products
| Method | Endpoint                        | Description           | Auth   |
|--------|---------------------------------|-----------------------|--------|
| GET    | `/api/products`                 | List (paginated)      | ❌     |
| GET    | `/api/products/{id}`            | Get by ID             | ❌     |
| GET    | `/api/products/search?query=`   | Search                | ❌     |
| GET    | `/api/products/category/{cat}`  | Filter by category    | ❌     |
| GET    | `/api/products/categories`      | All categories        | ❌     |
| POST   | `/api/products`                 | Create product        | ADMIN  |
| PUT    | `/api/products/{id}`            | Update product        | ADMIN  |
| DELETE | `/api/products/{id}`            | Delete product        | ADMIN  |

### Cart
| Method | Endpoint                   | Description        | Auth |
|--------|----------------------------|--------------------|------|
| GET    | `/api/cart`                | Get cart           | ✅   |
| POST   | `/api/cart/items`          | Add item           | ✅   |
| PUT    | `/api/cart/items/{id}`     | Update quantity    | ✅   |
| DELETE | `/api/cart/items/{id}`     | Remove item        | ✅   |
| DELETE | `/api/cart`                | Clear cart         | ✅   |

### Orders
| Method | Endpoint                            | Description       | Auth   |
|--------|-------------------------------------|-------------------|--------|
| POST   | `/api/orders/checkout`              | Checkout          | ✅     |
| GET    | `/api/orders`                       | My orders         | ✅     |
| GET    | `/api/orders/admin/all`             | All orders        | ADMIN  |
| PUT    | `/api/orders/admin/{id}/status`     | Update status     | ADMIN  |

---

## ✨ Features

**User Features:**
- JWT authentication (register, login, logout)
- Browse products with pagination, search, and category filters
- Product detail pages
- Shopping cart with quantity management
- Checkout with order creation
- Order history with status tracking

**Admin Features:**
- Product CRUD management
- Order management with status updates
- Inventory tracking (low stock alerts)

**Technical:**
- BCrypt password hashing
- JWT token-based stateless auth
- Role-based access control (USER, ADMIN)
- Global exception handling
- Validation with Hibernate Validator
- Swagger/OpenAPI documentation
- CORS configured for frontend
- Responsive dark-mode UI

---

## 🐳 Docker (Optional)

```bash
docker-compose up --build
```

Services:
- **PostgreSQL** → `localhost:5432`
- **Backend** → `localhost:8080`
- **Frontend** → `localhost:5173`

---

## 🔧 Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/antigravity
spring.datasource.username=postgres
spring.datasource.password=postgres
app.jwt.secret=YourSecretKey
app.jwt.expiration-ms=86400000
```

---

## 📄 License

MIT
