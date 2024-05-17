import { randomBytes } from "crypto";

// Function to generate a random token of specified length
const generateRandomToken = (length = 32) => {
  return new Promise((resolve, reject) => {
    randomBytes(Math.ceil(length / 2), (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        const token = buffer.toString("hex").slice(0, length);
        resolve(token);
      }
    });
  });
};

export { generateRandomToken };