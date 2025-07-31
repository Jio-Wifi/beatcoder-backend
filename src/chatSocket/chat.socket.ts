import { Server, Socket } from "socket.io";
import {
  addUserToRoom,
  removeUserFromRoom,
  getUsersInRoom,
  removeUserFromDirectChats,
  toggleUserVideo,
} from "../utils/socket";

export const registerChatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    // Join a chat room
    socket.on("join-room", ({ roomId, username }) => {
      socket.join(roomId);
      const users = addUserToRoom(roomId, socket.id, username);

      io.to(roomId).emit("room-users", users);
      io.to(roomId).emit("system-message", `${username} joined`);
    });

    // Leave room manually
    socket.on("leave-room", ({ roomId, username }) => {
      const removed = removeUserFromRoom(socket.id);
      if (removed) {
        io.to(roomId).emit("room-users", getUsersInRoom(roomId));
        io.to(roomId).emit("system-message", `${username} left`);
      }
    });

    // Toggle video (on/off)
    socket.on("toggle-video", ({ roomId, enabled }) => {
      const updatedUsers = toggleUserVideo(roomId, socket.id, enabled);
      io.to(roomId).emit("room-users", updatedUsers);
    });

    // WebRTC signaling: offer, answer, ICE candidates
    socket.on("webrtc-offer", ({ to, offer }) => {
      io.to(to).emit("webrtc-offer", { from: socket.id, offer });
    });

    socket.on("webrtc-answer", ({ to, answer }) => {
      io.to(to).emit("webrtc-answer", { from: socket.id, answer });
    });

    socket.on("webrtc-ice-candidate", ({ to, candidate }) => {
      io.to(to).emit("webrtc-ice-candidate", { from: socket.id, candidate });
    });

    // Broadcast chat message
    socket.on("chat-message", ({ roomId, user, message }) => {
      io.to(roomId).emit("chat-message", { user, message, time: new Date() });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      const removed = removeUserFromRoom(socket.id);
      removeUserFromDirectChats(socket.id);

      if (removed) {
        io.to(removed.roomId).emit("room-users", getUsersInRoom(removed.roomId));
        io.to(removed.roomId).emit("system-message", `${removed.username} left`);
      }
    });
  });
};
