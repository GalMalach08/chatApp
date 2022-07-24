const asyncHandler = require("express-async-handler");
const { notificationService } = require("../services");

// Get all users notification
const getNotificationsByUser = asyncHandler(async (req, res) => {
  try {
    const notifications = await notificationService.getNotificationsByUser(
      req.query
    );
    res.send({ notifications });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Create new notification
const addNotification = asyncHandler(async (req, res) => {
  try {
    const notification = await notificationService.addNotification(req.body);
    res.send({ notification });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Update the count of excisting notifcation
const updateNotification = asyncHandler(async (req, res) => {
  try {
    const notification = await notificationService.updateNotification(req.body);
    res.send({ notification });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
});

// Remove notification
const removeNotification = asyncHandler(async (req, res) => {
  try {
    const notification = await notificationService.removeNotification(req.body);
    res.send({ notification });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
});
module.exports = {
  addNotification,
  updateNotification,
  removeNotification,
  getNotificationsByUser,
};
