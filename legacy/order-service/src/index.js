import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use routes
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Order service running on port ${PORT}`);
});
