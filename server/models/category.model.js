// models/category.model.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      default: "https://globerec.com/wp-content/uploads/2022/10/consumer.jpeg",
    },
  },
  { timestamps: true }
);

 const Category = mongoose.model("Category", categorySchema);
 export default Category;
