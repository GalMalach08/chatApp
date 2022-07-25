const express = require("express");
const { connectDB } = require("./db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
require("dotenv").config();
require("colors");

const app = express();
connectDB();

// to accept json data
app.use(express.json());

// User route
const userRoute = require("./routes/userRoute");
app.use("/api/user", userRoute);
// Chat route
const chatRoute = require("./routes/chatRoute");
app.use("/api/chat", chatRoute);
// Message route
const messageRoute = require("./routes/messageRoute");
app.use("/api/message", messageRoute);
// Notification route
const notificationRoute = require("./routes/notificationRoute");
app.use("/api/notification", notificationRoute);
// Fall back routes
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () =>
  console.log(`server runs on port ${PORT}`.yellow.bold)
);

let connectedUsers = [];
const io = require("socket.io")(server, {
  pingTimeout: 60000, // if the connection not active for 60 sec close it
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    if (!connectedUsers.find((user) => user._id === userData._id)) {
      connectedUsers.push(userData);
    }
    io.emit("connected", connectedUsers);
  });

  socket.on("join chat", (roomId) => {
    socket.join(roomId);
    console.log(`user joined to room: ${roomId}`);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing", room));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessage) => {
    let chat = newMessage.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      socket.in(user._id).emit("message recived", newMessage);
    });
  });

  socket.on("disconnectUser", (userData) => {
    console.log("user disconnected");
    connectedUsers = connectedUsers.filter((user) => user._id !== userData._id);
    socket.disconnect();
    io.emit("disconnected", connectedUsers);
  });
});
