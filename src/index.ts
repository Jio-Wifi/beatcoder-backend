import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import config from './config';
import { connectDB } from './config/database';
import redisClient from './config/redis';
import { registerChatSocket } from './chatSocket/chat.socket';

const restartServer = async () => {
  try {
    await Promise.all([connectDB(), redisClient.connect()]);
    console.log("DB connected...");

    // Create HTTP server for Socket.IO
    const httpServer = http.createServer(app);

    // Attach Socket.IO
    const io = new Server(httpServer, {
      cors: {
        origin: config.FRONTEND_URL, // Allow frontend connection
        credentials: true,
      },
      maxHttpBufferSize: 1e8, // Support large SDP messages (WebRTC)
    });

    // Register chat + video signaling events
    registerChatSocket(io);

    // Start the server
    httpServer.listen(config.PORT, () => {
      console.log(`Server listening on port ${config.PORT}`);
    });

    // Graceful shutdown handlers
    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection:", reason);
      httpServer.close(() => {
        process.exit(1);
      });
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received. Shutting down...");
      await redisClient.quit();
      httpServer.close(() => {
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};

// Handle fatal errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

restartServer();
