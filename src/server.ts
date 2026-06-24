import { createApp } from "./app";
import { sequelize, testConnection } from "./config/database";
import { env } from "./config/env";
import "./models";

const start = async (): Promise<void> => {
  try {
    await testConnection();

    const app = createApp();

    const server = app.listen(env.port, () => {
      console.log(`Server running on port ${env.port} [${env.nodeEnv}]`);
      console.log(
        `Swagger docs available at http://localhost:${env.port}/api-docs`,
      );
    });

    const shutdown = async (signal: string): Promise<void> => {
      console.log(`Received ${signal}. Gracefully shutting down...`);

      // Stop accepting new connections, then close DB
      server.close(async () => {
        try {
          await sequelize.close();
          console.log("Database connection closed. Exiting.");
          process.exit(0);
        } catch (err) {
          console.error("Error during shutdown:", err);
          process.exit(1);
        }
      });

      // Force-exit if graceful shutdown takes too long
      setTimeout(() => {
        console.error("Shutdown timed out. Forcing exit.");
        process.exit(1);
      }, 10_000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

start();
