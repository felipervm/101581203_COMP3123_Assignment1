const mongoose = require("mongoose");
const logger = require("../utils/logger");

let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        dbName: "comp3123_assignment1",
      })
      .then((connection) => {
        logger.info("MongoDB connected", {
          database: connection.connection.name,
        });
        return connection.connection;
      })
      .catch((error) => {
        connectionPromise = null;
        logger.error("MongoDB connection failed", {
          message: error.message,
        });
        throw error;
      });
  }

  return connectionPromise;
}

module.exports = connectDB;
