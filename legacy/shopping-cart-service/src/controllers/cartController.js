// src/controllers/cartController.js
import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import { productCatalogClient } from "../services/productCatalogClient.js";

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  // Fetch product details for each item in the cart
  const cartWithDetails = await Promise.all(
    cart.items.map(async (item) => {
      const productDetails = await productCatalogClient.getProduct(
        item.product.toString()
      );
      return {
        ...item.toObject(),
        product: productDetails,
      };
    })
  );

  res.json({ ...cart.toObject(), items: cartWithDetails });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  // Fetch product details from product-catalog-service
  const product = await productCatalogClient.getProduct(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price, // Store the current price
    });
  }

  await cart.save();
  res.status(201).json(cart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  res.json(cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item._id.toString() !== req.params.itemId
  );
  await cart.save();

  res.json(cart);
});
