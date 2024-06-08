import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

class CartController {
  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user._id;

      const product = await Product.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({ user: userId, items: [], totalPrice: 0 });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price += product.price * quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity,
          price: product.price * quantity,
        });
      }

      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price,
        0
      );
      await cart.save();

      res
        .status(200)
        .json({ success: true, message: "Product added to cart", cart });
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add product to cart",
        error: error.message,
      });
    }
  }

  async removeFromCart(req, res) {
    try {
      const { itemId } = req.params;
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res
          .status(404)
          .json({ success: false, message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === itemId
      );

      if (itemIndex > -1) {
        cart.totalPrice -= cart.items[itemIndex].price;
        cart.items.splice(itemIndex, 1);
        await cart.save();

        res
          .status(200)
          .json({ success: true, message: "Item removed from cart", cart });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Item not found in cart" });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({
        success: false,
        message: "Failed to remove item from cart",
        error: error.message,
      });
    }
  }

  async updateCartItem(req, res) {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res
          .status(404)
          .json({ success: false, message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === itemId
      );
      if (itemIndex > -1) {
        const product = await Product.findById(cart.items[itemIndex].product);
        if (!product) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }

        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].price = product.price * quantity;
        cart.totalPrice = cart.items.reduce(
          (total, item) => total + item.price,
          0
        );
        await cart.save();

        res
          .status(200)
          .json({ success: true, message: "Cart item updated", cart });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Item not found in cart" });
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update cart item",
        error: error.message,
      });
    }
  }

  async getCart(req, res) {
    try {
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product"
      );
      if (!cart) {
        return res
          .status(404)
          .json({ success: false, message: "Cart not found" });
      }

      res.status(200).json({ success: true, cart });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch cart",
        error: error.message,
      });
    }
  }

  async clearCart(req, res) {
    try {
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res
          .status(404)
          .json({ success: false, message: "Cart not found" });
      }

      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();

      res.status(200).json({ success: true, message: "Cart cleared", cart });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({
        success: false,
        message: "Failed to clear cart",
        error: error.message,
      });
    }
  }

  async increaseCartItemQuantity(req, res) {
    try {
      const { itemId } = req.params;
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res
          .status(404)
          .json({ success: false, message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === itemId
      );
      if (itemIndex > -1) {
        const product = await Product.findById(cart.items[itemIndex].product);
        if (!product) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }

        cart.items[itemIndex].quantity += 1;
        cart.items[itemIndex].price =
          product.price * cart.items[itemIndex].quantity;
        cart.totalPrice = cart.items.reduce(
          (total, item) => total + item.price,
          0
        );
        await cart.save();

        res.status(200).json({
          success: true,
          message: "Cart item quantity increased",
          cart,
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Item not found in cart" });
      }
    } catch (error) {
      console.error("Error increasing cart item quantity:", error);
      res.status(500).json({
        success: false,
        message: "Failed to increase cart item quantity",
        error: error.message,
      });
    }
  }

  async decreaseCartItemQuantity(req, res) {
    try {
      const { itemId } = req.params;
      const userId = req.user._id;

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return res
          .status(404)
          .json({ success: false, message: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === itemId
      );
      if (itemIndex > -1) {
        const product = await Product.findById(cart.items[itemIndex].product);
        if (!product) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }

        if (cart.items[itemIndex].quantity > 1) {
          cart.items[itemIndex].quantity -= 1;
          cart.items[itemIndex].price =
            product.price * cart.items[itemIndex].quantity;
        } else {
          cart.items.splice(itemIndex, 1); // Remove item if quantity is 0 or less
        }
        cart.totalPrice = cart.items.reduce(
          (total, item) => total + item.price,
          0
        );
        await cart.save();

        res.status(200).json({
          success: true,
          message: "Cart item quantity decreased",
          cart,
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Item not found in cart" });
      }
    } catch (error) {
      console.error("Error decreasing cart item quantity:", error);
      res.status(500).json({
        success: false,
        message: "Failed to decrease cart item quantity",
        error: error.message,
      });
    }
  }
}

export default new CartController();
