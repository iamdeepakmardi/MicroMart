# Shopping Cart Service

This service manages the shopping cart functionality for the e-commerce platform.

## Features

- Get user's cart
- Add item to cart
- Update cart item quantity
- Remove item from cart

## Integration with Product Catalog Service

The Shopping Cart Service now integrates with the Product Catalog Service to fetch product details when adding items to the cart. This ensures that the cart always has the most up-to-date product information, including prices.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PRODUCT_CATALOG_SERVICE_URL=http://localhost:3001/api
   ```

   Adjust the `PRODUCT_CATALOG_SERVICE_URL` to match the actual URL of your Product Catalog Service.

3. Start the service:

   ```
   npm start
   ```

   For development with auto-restart:

   ```
   npm run dev
   ```

## API Endpoints

- `GET /api/cart`: Get user's cart
- `POST /api/cart`: Add item to cart
- `PUT /api/cart/:itemId`: Update cart item quantity
- `DELETE /api/cart/:itemId`: Remove item from cart

## Dependencies

- Express.js: Web application framework
- Mongoose: MongoDB object modeling
- JSON Web Token: Authentication
- Axios: HTTP client for communicating with the Product Catalog Service

## Error Handling

The service uses `express-async-handler` for handling asynchronous errors. Make sure to handle errors appropriately in your requests.

## Security

Ensure that you keep your JWT secret secure and use HTTPS in production environments.

## Docker

A Dockerfile is included for containerization. To build and run the Docker container:

```bash
docker build -t shopping-cart-service .
docker run --network host -e MONGODB_URI=mongodb://127.0.0.1:27017/shopping_cart_service
 -e JWT_SECRET=SUP3RS3CR3TK3Y -e PRODUCT_CATALOG_SERVICE_URL=http://localhost:3001/api shopping-cart-service
```

## Future Improvements

- Implement caching for product information to reduce calls to the Product Catalog Service
- Add unit and integration tests
- Implement rate limiting to prevent abuse of the API
