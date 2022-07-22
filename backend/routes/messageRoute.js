const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessagesFromChat,
} = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, sendMessage).get(protect, getMessagesFromChat);

module.exports = router;
