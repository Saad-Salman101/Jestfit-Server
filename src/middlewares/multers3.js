const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const config = require("../config/config");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fsPromises = require("fs").promises; // For promises-based methods
const fs = require("fs");

async function ensureUploadsDirExists() {
  try {
    await fsPromises.access(UPLOADS_DIR); // Check if the directory exists
  } catch (err) {
    if (err.code === "ENOENT") {
      await fsPromises.mkdir(UPLOADS_DIR, { recursive: true }); // Create the directory if it doesn't exist
    } else {
      throw err; // Rethrow unexpected errors
    }
  }
}

// Configure AWS S3 client
const s3 = new S3Client({
  region: config.AWS.S3.region,
  credentials: {
    accessKeyId: config.AWS.S3.accessKey,
    secretAccessKey: config.AWS.S3.secretKey,
  },
});

// Set up multer for temporary in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB per file
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and JPG are allowed."));
    }
  },
});

// Middleware to handle S3 uploads and image validation
// workins S3 Code
// const handleUpload = (isRequired = true) => {
//   console.log("zxcvb");
//   return [
//     // Use multer to parse and validate uploaded files
//     upload.array("images", 5), // Maximum of 5 images

//     // Middleware to upload files to S3 and handle `isRequired`
//     async (req, res, next) => {
//       if (!req.files || req.files.length === 0) {
//         console.log("yayyyyyyyyyyyyyyyyyyyyyyyyyyyyy", req.files);
//         if (isRequired) {
//           return res
//             .status(400)
//             .send({ message: "Image is required but not provided." });
//         } else {
//           req.filesData = [];
//           console.log("working1");
//           return next(); // Proceed without images
//         }
//       }

//       const uploadedFiles = [];
//       try {
//         // Loop through files and upload to S3
//         for (const file of req.files) {
//           console.log("yayyyyyyyy222", file.originalname);
//           const uploadParams = {
//             Bucket: config.AWS.S3.name,
//             Key: `${uuidv4()}${path.extname(file.originalname)}`,
//             Body: file.buffer,
//             ContentType: file.mimetype,
//           };

//           const data = await s3.send(new PutObjectCommand(uploadParams));
//           console.log("yayyyyyyyy3333", data);
//           // Store the S3 file URL
//           const fileUrl = `https://${config.AWS.S3.name}.s3.${config.AWS.S3.region}.amazonaws.com/${uploadParams.Key}`;
//           uploadedFiles.push(fileUrl);
//         }

//         req.filesData = uploadedFiles; // Pass URLs to the next middleware
//         console.log("working2");
//         next();
//       } catch (err) {
//         console.error("Error uploading to S3:", err);
//         res.status(500).json({ error: "Failed to upload files to S3." });
//       }
//     },
//   ];
// };

// S3 Code not working
// const handleUpload = (isRequired = true) => {
//   return [
//     // Use multer to parse and validate uploaded files
//     upload.array("images", 5), // Maximum of 5 images

//     // Middleware to upload files to S3 and handle `isRequired`
//     async (req, res, next) => {
//       if (!req.files || req.files.length === 0) {
//         if (isRequired) {
//           return res.status(400).send({ message: "Image is required but not provided." });
//         } else {
//           req.filesData = [];
//           return next(); // Proceed without images
//         }
//       }

//       const uploadedFiles = [];
//       try {
//         // Loop through files and upload to S3
//         for (const file of req.files) {
//           const uploadParams = {
//             Bucket: config.AWS.S3.name,
//             Key: `${uuidv4()}${path.extname(file.originalname)}`,
//             Body: file.buffer,
//             ContentType: file.mimetype,
//           };

//           const data = await s3.send(new PutObjectCommand(uploadParams));

//           // Store the S3 file URL
//           const fileUrl = `https://${config.AWS.S3.name}.s3.${config.AWS.S3.region}.amazonaws.com/${uploadParams.Key}`;
//           uploadedFiles.push(fileUrl);
//         }

//         req.filesData = uploadedFiles; // Pass URLs to the next middleware
//         next();
//       } catch (err) {
//         console.error("Error uploading to S3:", err);
//         res.status(500).json({ error: "Failed to upload files to S3." });
//       }
//     },
//   ];
// };

// Define the local storage directory
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

// Ensure the uploads directory exists
// Call the function before handling uploads
ensureUploadsDirExists().catch((err) => {
  console.error("Error ensuring uploads directory exists:", err);
});
const handleUpload = (isRequired = true) => {
  console.log("zxcvb");
  return [
    // Use multer to parse and validate uploaded files
    upload.array("images", 5), // Maximum of 5 images

    // Middleware to save files locally and handle `isRequired`
    async (req, res, next) => {
      if (!req.files || req.files.length === 0) {
        console.log("No files uploaded:", req.files);
        if (isRequired) {
          return res
            .status(400)
            .send({ message: "Image is required but not provided." });
        } else {
          req.filesData = []; // No files to process
          console.log("working1");
          return next(); // Proceed without images
        }
      }

      const uploadedFiles = [];
      try {
        // Loop through files and save them locally
        for (const file of req.files) {
          console.log("Processing file:", file.originalname);

          // Generate a unique file name
          const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
          const filePath = path.join(UPLOADS_DIR, fileName);
          console.log("File path:", filePath);
          // Save the file to the local directory using the promise-based API
          await fsPromises.writeFile(filePath, file.buffer);

          // Store the local file path
          uploadedFiles.push(`/uploads/${fileName}`);
        }

        req.filesData = uploadedFiles; // Pass file paths to the next middleware
        console.log("working2");
        next();
      } catch (err) {
        console.error("Error saving files locally:", err);
        res.status(500).json({ error: "Failed to save files locally." });
      }
    },
  ];
};

module.exports = { handleUpload };
