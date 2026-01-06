import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";

import cartRoutes from "./routes/cartRoutes.js";

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use("/api/cart", cartRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
