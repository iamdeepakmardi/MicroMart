import Stripe from "stripe";
import axios from "axios";
import Payment from "../models/Payment.js";
import dotenv from "dotenv";
// import jwt from "jsonwebtoken";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:3003";
const JWT_SECRET = process.env.JWT_SECRET;

console.log("JWT_SECRET:", JWT_SECRET);

async function verifyOrder(orderId, amountInCents, token) {
  try {
    console.log(
      `Verifying order: ${orderId} for amount: ${amountInCents} cents`
    );
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log("Headers being sent:", headers);

    const response = await axios.get(
      `${ORDER_SERVICE_URL}/api/orders/${orderId}`,
      {
        headers: headers,
      }
    );

    const order = response.data;
    console.log("Order from service:", order);

    const orderAmountInCents = Math.round(order.totalAmount * 100);

    if (order && orderAmountInCents === amountInCents) {
      console.log("Order verified successfully");
      return true;
    }

    console.log("Order verification failed");
    console.log("Expected amount (cents):", amountInCents);
    console.log("Actual amount (cents):", orderAmountInCents);
    return false;
  } catch (error) {
    console.error(
      "Error verifying order:",
      error.response ? error.response.data : error.message
    );
    return false;
  }
}

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, orderId } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    console.log(
      `Creating payment intent for order: ${orderId}, amount: ${amount}, currency: ${currency}`
    );

    // Convert amount to cents for Stripe
    const amountInCents = Math.round(amount * 100);

    const isOrderValid = await verifyOrder(orderId, amountInCents, token);
    if (!isOrderValid) {
      console.log(`Order validation failed for order: ${orderId}`);
      return res.status(400).json({ error: "Invalid order or amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata: { orderId },
    });

    res.status(200).json({
      Status: paymentIntent.status,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      error: "Failed to create payment intent",
      details: error.message,
    });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;
    const token = req.headers.authorization.split(" ")[1];

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Amount is already in cents, so we don't need to multiply by 100
    const amountInCents = paymentIntent.amount;

    const isOrderValid = await verifyOrder(orderId, amountInCents, token);
    if (!isOrderValid) {
      return res.status(400).json({ error: "Invalid order or amount" });
    }

    if (paymentIntent.status === "succeeded") {
      const payment = new Payment({
        orderId,
        amount: amountInCents / 100, // Convert back to dollars for storage
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        stripePaymentIntentId: paymentIntent.id,
      });
      await payment.save();

      await axios.put(
        `${ORDER_SERVICE_URL}/api/orders/${orderId}/status`,
        {
          status: "paid",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      res.status(200).json({ message: "Payment confirmed and saved" });
    } else {
      res.status(400).json({ error: "Payment not successful" });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: "Failed to confirm payment" });
  }
};

export const getPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ orderId });
    if (payment) {
      res.status(200).json(payment);
    } else {
      res.status(404).json({ error: "Payment not found" });
    }
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Failed to fetch payment" });
  }
};
