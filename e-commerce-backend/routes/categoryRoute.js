import express from "express";
import { createCategory, getCategories, readCategories, removeCategory, updateCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.route("/").post(createCategory);
router.route("/").get(getCategories);
router.route("/:id").patch(updateCategory);
router.route("/delete/:id").delete(removeCategory);
router.route("/single/:id").get(readCategories);

export default router;