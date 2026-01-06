# User Service Microservice

This microservice is part of a larger e-commerce platform built using a microservices architecture. It handles user-related operations such as registration, authentication, and profile management.

## Features

- User registration
- User login with JWT authentication
- Fetch user profile
- Update user profile
- Password hashing for security

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js (version 14 or later)
- You have a MongoDB instance running (local or remote)

## Setting Up the User Service

Follow these steps to get your development environment set up:

1. Clone the repository:

   ```
   git clone <repository-url>
   cd user-service
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/user_service
   JWT_SECRET=your_jwt_secret_here
   ```

   Replace `your_jwt_secret_here` with a secure random string.

4. Start the service:
   ```
   npm start
   ```
   For development with auto-reloading:
   ```
   npm run dev
   ```

## API Endpoints

- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Authenticate a user and receive a JWT
- `GET /api/users/profile`: Get the authenticated user's profile (protected route)
- `PUT /api/users/profile`: Update the authenticated user's profile (protected route)

## Docker

A Dockerfile is included for containerization. To build and run the Docker container:

```bash
docker build -t user-service .
docker run --network host -e MONGODB_URI=mongodb://127.0.0.1:27017/user_service -e JWT_SECRET=your_jwt_secret_here user-service
```

Replace `your_jwt_secret_here` with a secure random string.

## Contributing

Contributions to this project are welcome. Please ensure you follow the existing code style and include appropriate tests for new features.

## License

[MIT License](https://opensource.org/licenses/MIT)
