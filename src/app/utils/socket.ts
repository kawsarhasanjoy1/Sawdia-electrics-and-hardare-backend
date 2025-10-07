import { Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import { UserModel } from "../modules/user/model";

/**
 * Attach Socket.IO to the given HTTP server.
 */
export const socketUtils = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3000"],   // your Next.js frontend
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔵 Socket connected: ${socket.id}`);

    /**
     * Client emits `userOnline` after authenticating.
     * We store userId on socket.data and mark DB online.
     */
    socket.on("userOnline", async (userId: string) => {
      if (!userId) return;
      socket.data.userId = userId;
      await UserModel.findByIdAndUpdate(userId, { isOnline: true });
      io.emit("userStatusUpdate", { userId, status: "online" });
    });

    /**
     * Explicit manual offline event (optional).
     */
    socket.on("userOffline", async (userId: string) => {
      if (!userId) return;
      await UserModel.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });
      io.emit("userStatusUpdate", { userId, status: "offline" });
    });

    /**
     * Auto-cleanup when socket disconnects.
     */
    socket.on("disconnect", async () => {
      const userId = socket.data.userId;
      if (!userId) return;
      await UserModel.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
      });
      io.emit("userStatusUpdate", { userId, status: "offline" });
      console.log(`⚫ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
