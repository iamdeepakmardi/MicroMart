# Product Catalog Service Microservice

This microservice is part of a larger e-commerce platform built using a microservices architecture. It handles product and category-related operations such as creating, reading, updating, and deleting products and categories.

## Features

- Product management (CRUD operations)
- Category management (CRUD operations)
- Category-based product organization

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- Docker for containerization

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js (version 14 or later)
- You have a MongoDB instance running (local or remote)

## Setting Up the Product Catalog Service

Follow these steps to get your development environment set up:

1. Clone the repository:

   ```
   git clone <repository-url>
   cd product-catalog-service
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:

   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/product_catalog_service
   ```

4. Start the service:
   ```
   npm start
   ```
   For development with auto-reloading:
   ```
   npm run dev
   ```

## API Endpoints

- `POST /api/products`: Create a new product
- `GET /api/products?page=1&limit=10`: Get all products
- `GET /api/products/:id`: Get a specific product
- `PUT /api/products/:id`: Update a product
- `DELETE /api/products/:id`: Delete a product
- `POST /api/categories`: Create a new category
- `GET /api/categories`: Get all categories

## Docker

A Dockerfile is included for containerization. To build and run the Docker container:

```bash
docker build -t product-catalog-service .
docker run --network host -e MONGODB_URI=mongodb://127.0.0.1:27017/product_catalog_service product-catalog-service
```

## Contributing

Contributions to this project are welcome. Please ensure you follow the existing code style and include appropriate tests for new features.

## License

[MIT License](https://opensource.org/licenses/MIT)
