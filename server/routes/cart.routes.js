import express from "express";
import CartController from "../controllers/cart.controller.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", authMiddleware, CartController.addToCart);
router.delete("/remove/:itemId", authMiddleware, CartController.removeFromCart);
router.put("/update/:itemId", authMiddleware, CartController.updateCartItem);
router.get("/", authMiddleware, CartController.getCart);
router.delete("/clear", authMiddleware, CartController.clearCart);

router.patch(
  "/items/increase/:itemId",
  authMiddleware,
  CartController.increaseCartItemQuantity
);
router.patch(
  "/items/decrease/:itemId",
  authMiddleware,
  CartController.decreaseCartItemQuantity
);

export default router;
