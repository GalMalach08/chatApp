const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(({ connection: { host } }) =>
        console.log(`MongoDB connected on ${host}`.cyan.underline)
      );
  } catch (error) {
    console.log(`Error :${error.message}`.red.bold);
    process.exit();
  }
};

module.exports = { connectDB };
