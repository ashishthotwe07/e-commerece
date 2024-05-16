import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const verificationSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});

// Hash the token before saving it to the database
verificationSchema.pre("save", async function (next) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the token
    const hashedToken = await bcrypt.hash(this.token, salt);
    // Replace the plain token with the hashed token
    this.token = hashedToken;
    next();
  } catch (error) {
    next(error);
  }
});

// Static method to compare a token with a hashed token
verificationSchema.method.compareTokens = async function (token) {
  try {
    // Compare the provided token with the hashed token stored in the database
    const isMatch = bcrypt.compareSync(token, this.token);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

const Verification = mongoose.model("Verification", verificationSchema);

export default Verification;
