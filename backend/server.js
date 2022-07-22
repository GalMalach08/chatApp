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
// Fall back routes
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server runs on port ${PORT}`.yellow.bold));
