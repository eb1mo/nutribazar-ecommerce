import express from "express";
import { addProduct, fetchProductById, fetchProducts, getProductsByCategory, removeProduct, removeProductById, searchProductByTitle, updateProductDetails } from "../controllers/productController.js";
import { uploadProductImage } from "../middlewares/multer.js";
import { checkAdminModels } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.route("/").get(fetchProducts);
router.route("/add").post(uploadProductImage, addProduct);
router.route("/search").post(checkAdminModels, searchProductByTitle);
router.route("/:id").get(fetchProductById).delete(removeProductById);
router.route("/update/:id").patch(updateProductDetails);
router.route("/category/:id").get(getProductsByCategory);
router.route("/products").delete(removeProduct);
export default router;