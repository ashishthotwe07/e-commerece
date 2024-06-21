import express from "express";

import productController from "../controllers/product.controller.js";
import upload from "../config/upload.js";

const router = express.Router();

router.post(
  "/create-product",
  upload.array("images"),
  productController.createProduct
);
router.get("/", productController.getProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/:id", productController.getProduct);
router.put(
  "/update-product/:productId",
  upload.array("images", 5),
  productController.updateProduct
);
router.delete("/:id", productController.deleteProduct);

export default router;
