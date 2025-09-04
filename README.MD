# URL Shortener Backend API

A robust Node.js backend API for URL shortening with user authentication, organization management, and analytics tracking. Built with Express.js, MongoDB, and JWT authentication.

## 🚀 Features

- **URL Shortening**: Create short URLs with unique 6-character keys
- **User Authentication**: JWT-based authentication with signup/signin
- **Organization Management**: Multi-tenant organization support
- **Analytics Tracking**: Click count, location tracking, and timestamp logging
- **Rate Limiting**: 10 clicks per URL limit (configurable)
- **URL Expiration**: 7-day expiration for free tier
- **Geographic Tracking**: IP-based location detection
- **RESTful API**: Clean API endpoints with proper error handling

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd url-shortner/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Development Environment
   DEV_PORT=3000
   DEV_MONGODB_URI=mongodb://localhost:27017/url-shortener-dev
   DEV_JWT_SECRET_KEY=your-dev-jwt-secret-key

   # Production Environment
   PROD_PORT=3000
   PROD_MONGODB_URI=mongodb://localhost:27017/url-shortener-prod
   PROD_JWT_SECRET_KEY=your-prod-jwt-secret-key
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm run prod
   ```

## 📚 API Documentation

### Base URL
- Development: `http://localhost:3000`
- Production: `http://your-domain.com`

### Authentication Endpoints

#### POST `/api/v1/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User is created",
  "data": {
    "fullname": "John Doe",
    "email": "john@example.com",
    "organizationId": "org_id_here",
    "userId": "user_id_here"
  }
}
```

#### POST `/api/v1/auth/signin`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here"
}
```

### URL Management Endpoints

#### POST `/api/v1/short-url/new`
Create a new short URL. (Requires Authentication)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "originalURL": "https://www.example.com/very/long/url/path"
}
```

**Response:**
```json
{
  "success": true,
  "message": "New URL is created",
  "redirectURL": "http://localhost:3000/abc123"
}
```

#### GET `/:keyId`
Redirect to original URL using short URL key.

**Example:** `GET /abc123` → Redirects to original URL

### User Management Endpoints

#### GET `/api/v1/user/urls`
Get all URLs created by the authenticated user. (Requires Authentication)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "5 urls are found",
  "data": [
    {
      "_id": "url_id",
      "originalUrl": "https://example.com",
      "keyId": "abc123",
      "clickedCount": 3,
      "createdAt": 1640995200000,
      "openedAtTimestamp": [1640995200000, 1640995300000],
      "openedAtLocation": ["New York", "California"]
    }
  ]
}
```

#### DELETE `/api/v1/user/:userId`
Delete a user from the organization. (Requires Authentication - Admin only)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── auth.controller.js
│   │   ├── url.controller.js
│   │   └── user.controller.js
│   ├── middlewares/          # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── requestlogger.middleware.js
│   ├── models/               # MongoDB schemas
│   │   ├── organizations.model.js
│   │   ├── urls.model.js
│   │   └── users.model.js
│   ├── routers/              # API routes
│   │   └── v1/
│   │       ├── auth.router.js
│   │       ├── url.router.js
│   │       ├── user.router.js
│   │       └── v1.router.js
│   ├── services/             # Business logic
│   │   ├── organization.service.js
│   │   ├── url.service.js
│   │   └── user.service.js
│   ├── utils/                # Utility functions
│   │   ├── auth.utils.js
│   │   └── url.utils.js
│   ├── db/
│   │   └── connect.js        # Database connection
│   └── server.js             # Express app configuration
├── index.js                  # Application entry point
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DEV_PORT` | Development server port | Yes |
| `PROD_PORT` | Production server port | Yes |
| `DEV_MONGODB_URI` | MongoDB connection string for development | Yes |
| `PROD_MONGODB_URI` | MongoDB connection string for production | Yes |
| `DEV_JWT_SECRET_KEY` | JWT secret for development | Yes |
| `PROD_JWT_SECRET_KEY` | JWT secret for production | Yes |

### Rate Limits & Constraints

- **URL Click Limit**: 10 clicks per URL (free tier)
- **URL Expiration**: 7 days (free tier)
- **Key Length**: 6 characters
- **JWT Expiration**: 24 hours

## 🛡️ Security Features

- Password hashing using bcrypt
- JWT-based authentication
- CORS enabled for cross-origin requests
- Input validation and sanitization
- Organization-based access control

## 📊 Analytics Features

- Click count tracking
- Geographic location detection
- Timestamp logging for each click
- User-specific URL management

## 🚀 Deployment

1. **Set up MongoDB database**
2. **Configure environment variables for production**
3. **Install dependencies**: `npm install`
4. **Start the application**: `npm run prod`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env` file

2. **JWT Token Issues**
   - Verify JWT secret key is set
   - Check token expiration

3. **Port Already in Use**
   - Change port in `.env` file
   - Kill existing process using the port

### Support

For support and questions, please open an issue in the repository.