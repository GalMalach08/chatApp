const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    noti: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    count: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
