const asyncHandler = require("express-async-handler");
const { chatService } = require("../services");

// Create chat or get one if excist
const createOrGetChat = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId)
      throw new Error("Please provide the user to start the chat with");
    const chat = await chatService.createChat(req.user, userId);
    res.send({ chat });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get all the chats for specific user
const getChatsForUser = asyncHandler(async (req, res) => {
  try {
    const chats = await chatService.getChatsForUser(req.user._id);
    res.send({ chats });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Create group chat
const createGroupChat = asyncHandler(async (req, res) => {
  try {
    const chat = await chatService.createGroupChat(req.body, req.user._id);
    res.send({ chat });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Change the name for excisting group
const renameChatGroup = asyncHandler(async (req, res) => {
  try {
    const chat = await chatService.renameChatGroup(req.body);
    res.send({ chat });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Remove user from group
const removeUserFromGroup = asyncHandler(async (req, res) => {
  try {
    const chat = await chatService.removeUserFromGroup(req.body);
    res.send({ chat });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Add user to group
const addUserToGroup = asyncHandler(async (req, res) => {
  try {
    const chat = await chatService.addUserToGroup(req.body);
    res.send({ chat });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

module.exports = {
  createOrGetChat,
  getChatsForUser,
  renameChatGroup,
  createGroupChat,
  removeUserFromGroup,
  addUserToGroup,
};
