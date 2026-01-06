import express from "express";
import * as categoryController from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", categoryController.getAllCategories);
router.post("/", categoryController.createCategory);

export default router;

// TODO
//  Get a specific category
//  Update a category
//  Delete a category
