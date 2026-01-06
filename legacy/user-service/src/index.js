import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
