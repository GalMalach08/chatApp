const express = require("express");
const { connectDB } = require("./db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
require("dotenv").config();
require("colors");

const app = express();
connectDB();

// to accept json data
app.use(express.json());
// Routes

// User route
const userRoute = require("./routes/userRoute");
app.use("/api/user", userRoute);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server runs on port ${PORT}`.yellow.bold));
