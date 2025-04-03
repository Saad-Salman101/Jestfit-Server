const app = require("./app");
const mongoose = require("mongoose");
const config = require("./config/config");
const logger = require("./config/logger");
// const redis = require('redis');
// const { createAdapter } = require('@socket.io/redis-adapter');
const SocketController = require("./utils/socket.utils");

// Create the HTTP server and initialize Socket.io
let server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

// Connect to MongoDB
// mongoose.connect(config.mongoose.url, config.mongoose.options).then(async () => {
//   if (config.env === "development") {
//     logger.info("Connected to Development MongoDB");
//   } else {
//     logger.warn("Connected to Production MongoDB");
//   }

//   // Initialize Redis clients for the adapter
//   // const pubClient = redis.createClient({ url: `redis://${config.redis.url}` });
//   // const subClient = pubClient.duplicate(); // Duplicate the connection for subscribing

//   // pubClient.on('error', (err) => {
//   //   logger.error('Redis pubClient connection error:', err);
//   // });

//   // subClient.on('error', (err) => {
//   //   logger.error('Redis subClient connection error:', err);
//   // });

//   // await pubClient.connect();
//   // await subClient.connect();

//   // Use the Redis adapter for Socket.io
//   // io.adapter(createAdapter(pubClient, subClient));
//   // logger.info('Socket.io Redis adapter configured');

//   // Start the server
//   server.listen(config.port, () => {
//     logger.info(`Listening on port ${config.port}`);
//   });

//   // Initialize SocketController and handle socket connections
//   // const socketController = new SocketController(io, pubClient); // Pass the pubClient if needed
//   // io.on("connection", (socket) => socketController.connection(socket, pubClient));
// });

mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(async () => {
    logger.info(
      `Connected to ${config.env === "development" ? "Development" : "Production"} MongoDB`
    );

    // Start the server once MongoDB is connected
    server.listen(config.port, () => {
      logger.info(`Server is listening on port ${config.port}`);
    });

    // Initialize SocketController and handle socket connections
    const socketController = new SocketController(io); // Pass the pubClient if needed
    io.on("connection", (socket) => socketController.connection(socket));
  })
  .catch((err) => {
    logger.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit the process if the connection fails
  });
  
// Exit handler
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// Handle SIGINT and SIGTERM for graceful shutdown
process.on("SIGINT", exitHandler);
process.on("SIGTERM", exitHandler);
