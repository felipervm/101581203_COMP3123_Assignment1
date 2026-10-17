require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const logger = require("./src/utils/logger");

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not configured");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    await connectDB();

    app.listen(PORT, () => {
      logger.info("Server started", { port: Number(PORT) });
      console.log(`API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Server startup failed", { message: error.message });
    console.error(error.message);
    process.exit(1);
  }
}

start();
