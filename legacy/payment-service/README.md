# Payment Service

This microservice is responsible for processing payments, managing payment methods, and handling transactions within the scalable e-commerce platform.

## Features

- Process payments for orders
- Manage payment methods (i am using stripe)
- Handle refunds and cancellations
- Retrieve payment history for users

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Set up environment variables in a `.env` file:

   ```
   PORT=3004
   MONGODB_URI=mongodb://localhost:27017/payment_service_db
   JWT_SECRET=SUP3RS3CR3TK3Y
   ORDER_SERVICE_URL=http://localhost:3003
   USER_SERVICE_URL=http://localhost:3000
   ```

   Note: Ensure that the JWT_SECRET matches the one used in the User Service.

3. Start the service:
   ```
   npm run dev
   ```

## API Endpoints

- POST /api/payment/create-payment-intent - Create a new payment
- POST /api/payment/confirm - Confirm your payement
- GET /api/payments/user/:orderId - Get payment history for an order

## Docker

A Dockerfile is included for containerization. To build and run the Docker container:

```bash
docker build -t payment-service .

docker run --network host \
  -e MONGODB_URI=mongodb://127.0.0.1:27017/payment-service \
  -e JWT_SECRET=SUP3RS3CR3TK3Y \
  -e ORDER_SERVICE_URL=http://localhost:3003 \
  -e USER_SERVICE_URL=http://localhost:3000 \
  payment-service

or

docker run --network host --env-file .env payment-service
```

## Troubleshooting
