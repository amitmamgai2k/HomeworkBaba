
import { Server } from "socket.io";

let io;
// Store user socket mappings
const userSockets = new Map();
const socketUsers = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);


    socket.on("join", (data) => {

      const userId = typeof data === 'string' ? data : data.userId;

      // Store user-socket mapping
      userSockets.set(userId, socket.id);
      socketUsers.set(socket.id, userId);

      // Join user to their room
      socket.join(userId);

      console.log(`User ${userId} joined room with socket ${socket.id}`);

      // Send confirmation
      socket.emit("joined", { userId, message: "Successfully joined room" });
    });

    socket.emit("serverMessage", { text: "Hello from server!" });

    socket.on("disconnect", () => {
      const userId = socketUsers.get(socket.id);
      if (userId) {
        userSockets.delete(userId);
        socketUsers.delete(socket.id);
        console.log(`User ${userId} disconnected`);
      }
    });
  });
};

export const getIO = () => io;

export const sendMessageToSocketId = (socketId, message) => {
  console.log(`Sending message to socketId: ${socketId}, message:`, message);

  if (io) {
    io.to(socketId).emit(message.event, message.data);
  } else {
    console.error('Socket.io is not initialized');
  }
};

// New function to send message to user by userId
export const sendMessageToUser = (userId, event, data) => {
  console.log(`Sending message to userId: ${userId}, event: ${event}`, data);

  if (io) {
    // Method 1: Using room
    io.to(userId).emit(event, data);

    // Method 2: Using socket mapping (fallback)
    const socketId = userSockets.get(userId);
    if (socketId) {
      io.to(socketId).emit(event, data);
      console.log(`Message sent to user ${userId} via socket ${socketId}`);
      return true;
    } else {
      console.log(`User ${userId} is not connected`);
      return false;
    }
  } else {
    console.error('Socket.io is not initialized');
    return false;
  }
};

// Get connected users
export const getConnectedUsers = () => {
  return Array.from(userSockets.keys());
};

// Check if user is online
export const isUserOnline = (userId) => {
  return userSockets.has(userId);
};
