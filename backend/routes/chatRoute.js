const express = require("express");
const router = express.Router();
const {
  createOrGetChat,
  getChatsForUser,
  createGroupChat,
  renameChatGroup,
  removeUserFromGroup,
  addUserToGroup,
  updateGroup,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, createOrGetChat).get(protect, getChatsForUser);
router.route("/group").post(protect, createGroupChat);
router.put("/rename", protect, renameChatGroup);
router.put("/group", protect, updateGroup);
router.put("/removefromgroup", protect, removeUserFromGroup);
router.put("/addtogroup", protect, addUserToGroup);

module.exports = router;
