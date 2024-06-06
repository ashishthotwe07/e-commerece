import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    imageUrl: {
      type: String,
      default: "https://globerec.com/wp-content/uploads/2022/10/consumer.jpeg",
    },
  },
  { timestamps: true }
);

 const Subcategory = mongoose.model("Subcategory", subcategorySchema);
export default Subcategory;