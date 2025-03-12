# E-Commerce Backend API

![E-Commerce API](https://img.shields.io/badge/API-E--Commerce-blue)
![Express](https://img.shields.io/badge/Express-4.18.2-green)
![Prisma](https://img.shields.io/badge/Prisma-4.15.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1.6-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

A robust, scalable RESTful API backend for e-commerce applications built with Express.js, TypeScript, and Prisma ORM with PostgreSQL database.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Product Management](#product-management)
  - [Cart System](#cart-system)
  - [Order Processing](#order-processing)
  - [Payment Processing](#payment-processing)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Development](#-development)
  - [Running the Server](#running-the-server)
  - [Testing with Postman](#testing-with-postman)
- [Deployment](#-deployment)
- [License](#-license)

## ✨ Features

- **User Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (Admin/Customer)
  - Email verification via OTP
  - Password reset functionality

- **Product Management**

  - Categories with status management
  - Stock tracking
  - Image uploads
  - Product reviews and ratings

- **Shopping Cart System**

  - Add, update, remove items
  - Calculate subtotals
  - Persistent cart for registered users

- **Order Management**

  - Order creation and status tracking
  - Order history
  - Inventory management

- **Payment Processing**

  - Stripe integration for secure payments
  - Payment verification

- **Security**
  - Password hashing with bcrypt
  - Input validation
  - Error handling
  - CORS protection

## 🛠 Tech Stack

- **Backend Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Payment**: Stripe
- **Email**: Nodemailer
- **File Upload**: Multer
- **Validation**: Express Validator

## 📁 Project Structure

```
ecommerce-backend/
├── prisma/
│   ├── migrations/       # Generated database migrations
│   └── schema.prisma     # Prisma schema file
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Express middlewares
│   ├── routes/           # API routes
│   ├── services/         # Business logic and external services
│   ├── utils/            # Utility functions
│   ├── validations/      # Request validation schemas
│   ├── types/            # TypeScript type definitions
│   ├── app.ts            # Express application setup
│   └── server.ts         # Server entry point
├── uploads/              # Uploaded files storage
├── .env                  # Environment variables
├── package.json          # Project dependencies
└── tsconfig.json         # TypeScript configuration
```

## 📚 API Documentation

### Authentication

| Endpoint                     | Method | Description            | Authentication Required |
| ---------------------------- | ------ | ---------------------- | :---------------------: |
| `/api/auth/register`         | POST   | Register a new user    |           No            |
| `/api/auth/verify-otp`       | POST   | Verify email with OTP  |           No            |
| `/api/auth/login`            | POST   | Login user             |           No            |
| `/api/auth/logout`           | POST   | Logout user            |           Yes           |
| `/api/auth/forgot-password`  | POST   | Request password reset |           No            |
| `/api/auth/verify-reset-otp` | POST   | Verify reset OTP       |           No            |
| `/api/auth/reset-password`   | POST   | Set new password       |           No            |

### User Management

| Endpoint                     | Method | Description         | Authentication Required |
| ---------------------------- | ------ | ------------------- | :---------------------: |
| `/api/users/profile`         | GET    | Get user profile    |           Yes           |
| `/api/users/profile`         | PATCH  | Update user profile |           Yes           |
| `/api/users/change-password` | POST   | Change password     |           Yes           |

### Product Management

| Endpoint            | Method | Description          | Authentication Required |
| ------------------- | ------ | -------------------- | :---------------------: |
| `/api/products`     | GET    | Get all products     |           No            |
| `/api/products/:id` | GET    | Get a single product |           No            |
| `/api/products`     | POST   | Create a product     |       Yes (Admin)       |
| `/api/products/:id` | PUT    | Update a product     |       Yes (Admin)       |
| `/api/products/:id` | DELETE | Delete a product     |       Yes (Admin)       |

### Cart System

| Endpoint                  | Method | Description           | Authentication Required |
| ------------------------- | ------ | --------------------- | :---------------------: |
| `/api/cart`               | GET    | Get user's cart       |           Yes           |
| `/api/cart/items`         | POST   | Add item to cart      |           Yes           |
| `/api/cart/items/:itemId` | PUT    | Update cart item      |           Yes           |
| `/api/cart/items/:itemId` | DELETE | Remove item from cart |           Yes           |
| `/api/cart`               | DELETE | Clear cart            |           Yes           |

### Order Processing

| Endpoint          | Method | Description       | Authentication Required |
| ----------------- | ------ | ----------------- | :---------------------: |
| `/api/orders`     | GET    | Get user's orders |           Yes           |
| `/api/orders/:id` | GET    | Get order details |           Yes           |

### Payment Processing

| Endpoint                                | Method | Description            | Authentication Required |
| --------------------------------------- | ------ | ---------------------- | :---------------------: |
| `/api/checkout/create-checkout-session` | POST   | Create payment session |           Yes           |
| `/api/checkout/confirm-payment`         | POST   | Confirm payment        |           Yes           |

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ecommerce-backend.git
   cd ecommerce-backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see next section)

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce"

# JWT Authentication
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=no-reply@yourecommerce.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env` file
3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

## 💻 Development

### Running the Server

For development with hot-reload:

```bash
npm run dev
```

For production:

```bash
npm run build
npm start
```

### Testing with Postman

1. Import the [Postman Collection](./postman/ecommerce-api.json)
2. Set up an environment with variables:
   - `baseUrl`: `http://localhost:4000/api`
   - `token`: [leave empty initially]
3. Use the authentication endpoints to get a token
4. Test the various API endpoints

## 🌐 Deployment

This API can be deployed to various platforms:

- **Railway/Heroku**:

  ```bash
  # Add remote
  heroku git:remote -a your-app-name

  # Push to Heroku
  git push heroku main
  ```

- **AWS/DigitalOcean**:
  1. Set up a server with Node.js
  2. Set up PostgreSQL database
  3. Clone repository and install dependencies
  4. Set up environment variables
  5. Build and run the application

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by [Olivier Iradukunda](https://github.com/Mr-Olivier)
