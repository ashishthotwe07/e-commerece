import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Subcategory from "../models/subcategory.model.js";
import cloudinary from "cloudinary";
import slugify from "slugify";
import Review from "../models/productreivew.model.js";

class ProductController {
  async createProduct(req, res) {
    try {
      // Check if images are provided
      const images = req.files || [];

      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const b64 = Buffer.from(image.buffer).toString("base64");
          const dataURI = `data:${image.mimetype};base64,${b64}`;
          const result = await cloudinary.uploader.upload(dataURI, {
            folder: "Products",
          });
          return { url: result.secure_url, public_id: result.public_id };
        })
      );

      const {
        name,
        description,
        price,
        quantity,
        categoryName,
        subcategoryName,
        brand,
        color,
        tags,
        discountPrice,
        featured,
        onSale,
      } = req.body;

      if (
        !name ||
        !description ||
        !price ||
        !quantity ||
        !categoryName ||
        !subcategoryName
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, description, price, quantity, categoryName, and subcategoryName are required fields",
        });
      }

      // Generate slug from category name and product name
      const categorySlug = slugify(categoryName, { lower: true });
      const subcategorySlug = slugify(subcategoryName, { lower: true });
      const productSlug = slugify(name, { lower: true });

      // Find or create category based on the slug
      let category = await Category.findOne({ slug: categorySlug });
      if (!category) {
        category = await Category.create({
          name: categoryName,
          slug: categorySlug,
        });
      }

      // Find or create subcategory based on the slug
      let subcategory = await Subcategory.findOne({ slug: subcategorySlug });
      if (!subcategory) {
        subcategory = await Subcategory.create({
          name: subcategoryName,
          slug: subcategorySlug,
          category: category._id,
        });
      }

      // Create the product with image URLs and optional fields
      const product = await Product.create({
        name,
        slug: productSlug,
        description,
        price,
        quantity,
        category: category._id,
        subcategory: subcategory._id,
        brand,
        color,
        images: imageUrls,
        tags: tags ? tags.toUpperCase().split(",") : [],
        discountPrice,

        featured: featured || false,
        onSale: onSale || false,
      });

      // Respond with success message and created product details
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create product",
        error: error.message,
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const productId = req.params.productId;

      if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
      }

      // Find the product by ID
      let product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Extract updated product details from the request body
      const {
        name,
        description,
        price,
        quantity,
        categoryName,
        subcategoryName,
        brand,
        color,
        tags,
        discountPrice,

        featured,
        onSale,
      } = req.body;

      const images = req.files || [];
      let removedImages = req.body.removedImages;
      // Parse removedImages as JSON array if it's a string
      if (typeof removedImages === "string") {
        removedImages = JSON.parse(removedImages);
      }

      // Delete removed images from Cloudinary
      if (removedImages) {
        await Promise.all(
          removedImages.map(async (imageId) => {
            product.images = product.images.filter(
              (img) => img.public_id !== imageId
            );
            await cloudinary.uploader.destroy(imageId, { invalidate: true });
          })
        );
      }

      if (images) {
        const newImageUrls = await Promise.all(
          images.map(async (image) => {
            const b64 = Buffer.from(image.buffer).toString("base64");
            const dataURI = `data:${image.mimetype};base64,${b64}`;
            const result = await cloudinary.uploader.upload(dataURI, {
              folder: "Products",
            });
            return { url: result.secure_url, public_id: result.public_id };
          })
        );

        // Merge new image URLs with existing ones
        product.images = [...product.images, ...newImageUrls];
      }

      let category, subcategory;
      if (categoryName) {
        const categorySlug = slugify(categoryName, { lower: true });
        category = await Category.findOne({ slug: categorySlug });
        if (!category) {
          category = await Category.create({
            name: categoryName,
            slug: categorySlug,
          });
        }
      }

      if (subcategoryName) {
        const subcategorySlug = slugify(subcategoryName, { lower: true });
        subcategory = await Subcategory.findOne({ slug: subcategorySlug });
        if (!subcategory) {
          subcategory = await Subcategory.create({
            name: subcategoryName,
            slug: subcategorySlug,
            category: category ? category._id : product.category,
          });
        }
      }

      // Update product fields
      product.name = name || product.name;
      product.slug = name ? slugify(name, { lower: true }) : product.slug;
      product.description = description || product.description;
      product.price = price || product.price;
      product.quantity = quantity || product.quantity;
      product.brand = brand || product.brand;
      product.color = color || product.color;
      product.tags = tags ? tags.toUpperCase().split(",") : product.tags;
      product.discountPrice = discountPrice || null;
      product.featured = featured || product.featured;
      product.onSale = onSale || product.onSale;

      // Save the updated product
      await product.save();

      // Respond with success message and updated product details
      res.json({ message: "Product updated successfully", product });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getProduct(req, res) {
    try {
      const productId = req.params.id;

      // Find the product by ID and populate the category and subcategory
      const product = await Product.findById(productId)
        .populate("category subcategory")
        .populate({
          path: "reviews",
          select: "rating",
        });

      // Check if the product exists
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Calculate the average rating for the product
      const ratings = product.reviews.map((review) => review.rating);
      const totalReviews = product.reviews.length;
      const averageRating =
        totalReviews > 0
          ? ratings.reduce((acc, curr) => acc + curr, 0) / totalReviews
          : 0;

      // Respond with the product details, total reviews, and average rating
      res.status(200).json({
        success: true,
        product,
        totalReviews,
        averageRating,
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch product",
        error: error.message,
      });
    }
  }

  async getProducts(req, res) {
    try {
      const {
        subcategory,
        minPrice,
        maxPrice,
        brands,
        sort,
        search,
        colors,
        discount,
        featured,
        onSale,
      } = req.query;

      const colorArray = colors ? colors.split(",") : [];

      // Construct the query
      const query = {
        price: { $gte: minPrice || 0, $lte: maxPrice || Infinity },
        brand: brands ? { $in: brands.split(",") } : undefined,
        color: colorArray.length ? { $in: colorArray } : undefined,
        name: search ? { $regex: search, $options: "i" } : undefined,
        featured: featured === "true" ? true : undefined, // Convert to boolean
        onSale: onSale === "true" ? true : undefined, // Check if onSale is true
      };

      // Add discount filter only if discount is specified
      if (discount) {
        query.discountPrice = { $gte: discount };
      }

      // If subcategory is provided, convert it to a slug and find the corresponding subcategory
      if (subcategory) {
        const subcategorySlug = slugify(subcategory, { lower: true });
        const foundSubcategory = await Subcategory.findOne({
          slug: subcategorySlug,
        });

        if (foundSubcategory) {
          query.subcategory = foundSubcategory._id;
        } else {
          return res.json({ products: [] });
        }
      }

      // Remove undefined fields from the query object
      Object.keys(query).forEach(
        (key) => query[key] === undefined && delete query[key]
      );

      // Fetch products matching the query and populate the reviews
      let products = await Product.find(query)
        .populate({
          path: "reviews",
          select: "rating",
        })
        .limit(featured === "true" ? 10 : undefined); // Limit to 10 if featured is true

      // Calculate average rating for each product
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const ratings = await Review.find({ product: product._id }).select(
          "rating"
        );
        const totalRating = ratings.reduce((acc, curr) => acc + curr.rating, 0);
        const averageRating =
          ratings.length > 0 ? totalRating / ratings.length : 0;
        product.averageRating = averageRating;
      }

      // Apply sorting
      if (sort === "Price: Low to High") {
        products = products.sort((a, b) => a.price - b.price);
      } else if (sort === "Price: High to Low") {
        products = products.sort((a, b) => b.price - a.price);
      } else if (sort === "Best Rating") {
        products = products.sort((a, b) => b.averageRating - a.averageRating);
      } else if (sort === "Newest") {
        products = products.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      }

      res.json({ products });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;

      // Find the product by ID
      const product = await Product.findById(productId);

      // Check if the product exists
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Delete product images from Cloudinary
      await Promise.all(
        product.images.map(async (image) => {
          await cloudinary.uploader.destroy(image.public_id, {
            invalidate: true,
          });
        })
      );

      // Delete the product from the database
      await Product.findByIdAndDelete(productId);

      // Respond with success message
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getNewArrivals(req, res) {
    try {
      // Fetch the newest 10 products, sorted by creation date in descending order
      let products = await Product.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate({
          path: "reviews",
          select: "rating",
        });

      // Respond with the new arrival products
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch new arrivals",
        error: error.message,
      });
    }
  }
}

export default new ProductController();
