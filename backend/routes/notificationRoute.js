const express = require("express");
const router = express.Router();
const {
  addNotification,
  removeNotification,
  updateNotification,
  getNotificationsByUser,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getNotificationsByUser)
  .post(protect, addNotification)
  .put(protect, updateNotification)
  .delete(protect, removeNotification);

module.exports = router;
