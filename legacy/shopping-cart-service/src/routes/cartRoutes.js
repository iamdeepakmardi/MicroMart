import express from "express";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getCart).post(addItemToCart);

router.route("/:itemId").put(updateCartItem).delete(removeCartItem);

export default router;
