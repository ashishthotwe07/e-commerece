import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    brand: {
      type: String,
    },
    color: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    rating: [
      {
        star: {
          type: Number,
          required: true,
        },
        by: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    sold: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
