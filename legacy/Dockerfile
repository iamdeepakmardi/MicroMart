# Base image
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# User Service
FROM base AS user-service
WORKDIR /usr/src/app/user-service
COPY user-service/package*.json ./
RUN npm install
COPY user-service .
COPY user-service/.env.example .env

# Product Catalog Service
FROM base AS product-catalog-service
WORKDIR /usr/src/app/product-catalog-service
COPY product-catalog-service/package*.json ./
RUN npm install
COPY product-catalog-service .
COPY product-catalog-service/.env.example .env

# Shopping Cart Service
FROM base AS shopping-cart-service
WORKDIR /usr/src/app/shopping-cart-service
COPY shopping-cart-service/package*.json ./
RUN npm install
COPY shopping-cart-service .
COPY shopping-cart-service/.env.example .env

# Order Service
FROM base AS order-service
WORKDIR /usr/src/app/order-service
COPY order-service/package*.json ./
RUN npm install
COPY order-service .
COPY order-service/.env.example .env

# Payment Service
FROM base AS payment-service
WORKDIR /usr/src/app/payment-service
COPY payment-service/package*.json ./
RUN npm install
COPY payment-service .
COPY payment-service/.env.example .env

# Final stage
FROM base
WORKDIR /usr/src/app

# Copy built services
COPY --from=user-service /usr/src/app/user-service ./user-service
COPY --from=product-catalog-service /usr/src/app/product-catalog-service ./product-catalog-service
COPY --from=order-service /usr/src/app/order-service ./order-service
COPY --from=shopping-cart-service /usr/src/app/shopping-cart-service ./shopping-cart-service
COPY --from=payment-service /usr/src/app/payment-service ./payment-service

# Expose ports
EXPOSE 3000 3001 3002 3003 3004

# Start all services
CMD ["sh", "-c", "cd ../user-service && npm start & cd ../product-catalog-service && npm start & cd ../shopping-cart-service && npm start & cd order-service && npm start & cd ../payment-service && npm start"]

# Note: For production use, it's recommended to manage environment variables securely,
# potentially using Docker secrets, environment-specific .env files, or a configuration management system :)