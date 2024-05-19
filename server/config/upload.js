import multer from "multer";

// Define storage configuration
const storage = multer.memoryStorage(); 

const upload = multer({ storage: storage });

export default upload;
