// src/config/multer.config.js
import fs from "fs";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the uploads folder to your project root's "uploads" folder
const uploadsFolder = path.join(__dirname, "..", "..", "uploads");

// Ensure the uploads folder exists
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsFolder);
  },
  filename: (req, file, cb) => {
    // Log the original file name and file object for troubleshooting
    console.log("Original file name:", file.originalname);
    console.log("File object:", file);

    // Use path.basename to extract only the base file name
    let originalName = path.basename(file.originalname);
    // Remove any potentially problematic characters
    originalName = originalName.replace(/[:\\/*?"<>|]/g, "");
    const ext = path.extname(originalName) || ".xlsx";
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const newFilename = `${uniqueSuffix}-${originalName}`;

    // Log the computed new file name
    console.log("Computed new filename:", newFilename);

    cb(null, newFilename);
  },
});

export const upload = multer({ storage });
