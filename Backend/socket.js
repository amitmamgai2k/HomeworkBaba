import { Server } from "socket.io";
let io;
export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    // Handle user joining a room
    socket.on("join", (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
    });
     socket.emit("serverMessage", { text: "Hello from server!" });


    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
export const getIO = () => io;
export const sendMessageToSocketId = (socketId, message) => {
    console.log(`Sending message to socketId: ${socketId} ,message: ${message}`);

    if (io) {
        io.to(socketId).emit(message.event, message.data);
    } else {
        console.error('Socket.io is not initialized');
    }
};
