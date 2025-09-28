import mongoose from "mongoose";
import { app } from "./app"; // <- your Express app
import config from "./app/config/config"; // <- contains dbUrl & port
import { createServer } from "http";
import { socketUtils } from "./app/utils/socket";
import { seedSuperAdmin } from "./app/DB/seedSuperAdmin";

async function main() {
  try {
    await mongoose.connect(config.dbUrl as string);
    console.log("✅ MongoDB connected");
    const httpServer = createServer(app);
    socketUtils(httpServer);
    httpServer.listen(config.port || 5000, "0.0.0.0", () => {
      seedSuperAdmin();
      console.log(`🚀 Server running on http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("❌ Fatal error starting server:", err);
    process.exit(1);
  }
}

main();
