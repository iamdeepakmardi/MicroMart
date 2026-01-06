# Order Service

This microservice is responsible for processing orders, tracking order status, and managing order history within the scalable e-commerce platform.

## Features

- Create new orders with validation for user, products, and pricing
- Retrieve order details
- Update order status
- Get order history for a user

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Set up environment variables in a `.env` file:

   ```
   PORT=3003
   MONGODB_URI=mongodb://localhost:27017/order_service_db
   JWT_SECRET=SUP3RS3CR3TK3Y
   USER_SERVICE_URL=http://localhost:3000
   PRODUCT_SERVICE_URL=http://localhost:3001
   ```

   Note: Ensure that the JWT_SECRET matches the one used in the User Service.

3. Start the service:
   ```
   npm start
   ```

## API Endpoints

- POST /api/orders - Create a new order
- GET /api/orders/:orderId - Get order details
- PUT /api/orders/:orderId/status - Update order status
- GET /api/orders/user/:userId - Get order history for a user

## Docker

A Dockerfile is included for containerization. To build and run the Docker container:

```bash
docker build -t order-service .

docker run --network host \
  -e MONGODB_URI=mongodb://127.0.0.1:27017/order-service \
  -e JWT_SECRET=SUP3RS3CR3TK3Y \
  -e USER_SERVICE_URL=http://localhost:3000 \
  -e PRODUCT_SERVICE_URL=http://localhost:3001 \
  order-service

or

docker run --network host --env-file .env order-service
```

## Troubleshooting

1. Authentication Issues:

   - Ensure the JWT_SECRET in the Order Service's .env file matches the one in the User Service.
   - Always run the "Login (Get Token)" request before testing other endpoints.
   - Check that the authToken is being correctly set in the Postman environment variables.

2. User or Product Verification Failures:

   - Confirm that the User Service and Product Service are running and accessible.
   - Verify that the user IDs and product IDs you're using in requests actually exist in their respective services.

3. Total Amount Mismatch:

   - Double-check that the prices in your order request match the actual prices in the Product Service.
   - Ensure the calculated total matches the sum of (price \* quantity) for all items in the order.

4. If you make any changes to the .env file or server code:
   - Always restart the Order Service to ensure changes take effect.

## Integration with Other Services

The Order Service integrates with:

- User Service: For verifying user existence and authentication
- Product Catalog Service: For verifying product existence and prices

Ensure that these services are running and accessible via the URLs specified in the .env file.

## Notes

- The service assumes that the User Service and Product Catalog Service have endpoints for retrieving user and product information by ID.
- For production deployment, consider using a more robust method for inter-service communication, such as message queues or service mesh.
