const Chat = require("../db/models/chatModel");
const User = require("../db/models/userModel");
const Notification = require("../db/models/notificationModel");

// Get all users notification
const getNotificationsByUser = async (body) => {
  try {
    const { userId } = body;
    const notifications = await Notification.find({ user: userId }).populate(
      "noti"
    );
    let fullnotifications = await Chat.populate(notifications, {
      path: "noti.chat",
    });
    fullnotifications = await User.populate(fullnotifications, {
      path: "noti.sender",
    });
    fullnotifications = await User.populate(fullnotifications, {
      path: "noti.chat.users",
    });
    if (fullnotifications) return fullnotifications;
    else return [];
  } catch (err) {
    throw new Error(err);
  }
};
// Create new notification
const addNotification = async (body) => {
  try {
    const { count, noti, user } = body;
    let notification = await Notification.create({ count, noti, user });
    notification = await Notification.findById(notification._id).populate(
      "noti"
    );
    let fullnotification = await Chat.populate(notification, {
      path: "noti.chat",
    });
    fullnotification = await User.populate(fullnotification, {
      path: "noti.sender",
    });
    fullnotification = await User.populate(fullnotification, {
      path: "noti.chat.users",
    });
    if (fullnotification) return fullnotification;
    else throw new Error("Error occured, notification didnt uploaded");
  } catch (err) {
    throw new Error(err);
  }
};

// Update the count of excisting notifcation
const updateNotification = async (body) => {
  try {
    const { notiId } = body;
    const notification = await Notification.findByIdAndUpdate(
      notiId,
      { $inc: { count: 1 } },
      { new: true }
    ).populate("noti");

    let fullnotification = await Chat.populate(notification, {
      path: "noti.chat",
    });
    fullnotification = await User.populate(fullnotification, {
      path: "noti.sender",
    });
    fullnotification = await User.populate(fullnotification, {
      path: "noti.chat.users",
    });

    if (fullnotification) return fullnotification;
    else throw new Error("Error occured, notification didnt uploaded");
  } catch (err) {
    throw new Error(err);
  }
};

// Update the count of excisting notifcation
const removeNotification = async (body) => {
  try {
    const { notiId } = body;
    const notification = await Notification.findByIdAndDelete(notiId);

    if (notification) return notification;
    else throw new Error("Error occured, notification didnt deleted");
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  addNotification,
  updateNotification,
  removeNotification,
  getNotificationsByUser,
};
