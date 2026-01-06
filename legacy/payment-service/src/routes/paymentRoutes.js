import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  getPayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/confirm", confirmPayment);
router.get("/:orderId", getPayment);

export default router;
