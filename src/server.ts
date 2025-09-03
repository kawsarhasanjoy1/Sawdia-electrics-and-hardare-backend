import mongoose from "mongoose";
import { app } from "./app";
import config from "./app/config/config";

async function main() {
  await mongoose.connect(config.dbUrl as string);
  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
}

main().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});