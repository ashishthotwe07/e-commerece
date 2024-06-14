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
    discountPrice: {
      type: Number,
      default: null,
    },
    discountPercentage: {
      type: Number,
      default: null,
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
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: false,
    },
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
    sold: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
    featured: {
      type: Boolean,
      default: false,
    },
    onSale: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.methods.calculateDiscountPercentage = function () {
  if (this.discountPrice && this.price) {
    return ((this.price - this.discountPrice) / this.price) * 100;
  }
  return null;
};

const Product = mongoose.model("Product", productSchema);

export default Product;
