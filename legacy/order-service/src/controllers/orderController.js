import Order from "../models/orderModel.js";
import { verifyUser } from "../services/userService.js";
import { verifyProduct } from "../services/productService.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, shippingAddress } = req.body;

    // console.log(`Attempting to create order for user: ${userId}`);

    // Verify user
    try {
      const user = await verifyUser(userId);
      // console.log(`User verified successfully: ${userId}`);
    } catch (error) {
      //  console.error(`User verification failed: ${error.message}`);
      if (error.message.includes("User not found")) {
        return res.status(404).json({ message: `User not found: ${userId}` });
      } else if (error.message.includes("Failed to verify user after")) {
        return res.status(503).json({
          message:
            "User service is currently unavailable. Please try again later.",
        });
      } else {
        return res
          .status(400)
          .json({ message: `User verification failed: ${error.message}` });
      }
    }

    // Verify products and recalculate total amount
    let calculatedTotal = 0;
    for (const item of items) {
      try {
        const product = await verifyProduct(item.productId);
        if (product.price !== item.price) {
          throw new Error(`Price mismatch for product ${item.productId}`);
        }
        calculatedTotal += product.price * item.quantity;
      } catch (error) {
        //  console.error(`Product verification failed: ${error.message}`);
        return res
          .status(400)
          .json({ message: `Product verification failed: ${error.message}` });
      }
    }

    // Check if the calculated total matches the provided total
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      // console.error(
      //   `Total amount mismatch: calculated ${calculatedTotal}, provided ${totalAmount}`
      // );
      return res.status(400).json({ message: "Total amount mismatch" });
    }

    const newOrder = new Order({
      userId,
      items,
      totalAmount: calculatedTotal,
      shippingAddress,
    });

    await newOrder.save();
    // console.log(`Order created successfully for user: ${userId}`);
    res.status(201).json(newOrder);
  } catch (error) {
    // console.error(`Order creation failed: ${error.message}`);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
