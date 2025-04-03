const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const config = require("../config/config");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

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
const handleUpload = (isRequired = true) => {
  console.log("zxcvb");
  return [
    // Use multer to parse and validate uploaded files
    upload.array("images", 5), // Maximum of 5 images

    // Middleware to upload files to S3 and handle `isRequired`
    async (req, res, next) => {
      if (!req.files || req.files.length === 0) {
        console.log("yayyyyyyyyyyyyyyyyyyyyyyyyyyyyy", req.files);
        if (isRequired) {
          return res
            .status(400)
            .send({ message: "Image is required but not provided." });
        } else {
          req.filesData = [];
          console.log("working1");
          return next(); // Proceed without images
        }
      }

      const uploadedFiles = [];
      try {
        // Loop through files and upload to S3
        for (const file of req.files) {
          console.log("yayyyyyyyy222", file.originalname);
          const uploadParams = {
            Bucket: config.AWS.S3.name,
            Key: `${uuidv4()}${path.extname(file.originalname)}`,
            Body: file.buffer,
            ContentType: file.mimetype,
          };

          const data = await s3.send(new PutObjectCommand(uploadParams));
          console.log("yayyyyyyyy3333", data);
          // Store the S3 file URL
          const fileUrl = `https://${config.AWS.S3.name}.s3.${config.AWS.S3.region}.amazonaws.com/${uploadParams.Key}`;
          uploadedFiles.push(fileUrl);
        }

        req.filesData = uploadedFiles; // Pass URLs to the next middleware
        console.log("working2");
        next();
      } catch (err) {
        console.error("Error uploading to S3:", err);
        res.status(500).json({ error: "Failed to upload files to S3." });
      }
    },
  ];
};

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

module.exports = { handleUpload };
