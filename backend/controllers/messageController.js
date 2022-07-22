const asyncHandler = require("express-async-handler");
const { messageService } = require("../services");

// Send message
const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { fullMessage, latestMessage } = await messageService.sendMessage(
      req.body,
      req.user._id
    );
    res.status(201).send({
      message: fullMessage,
      latestMessage,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
});

// Get all messages from praticular chat
const getMessagesFromChat = asyncHandler(async (req, res) => {
  try {
    const chatMessages = await messageService.getMessagesFromChat(
      req.query.chatId
    );
    res.status(201).send({
      chatMessages,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ error: err.message });
  }
});

module.exports = { sendMessage, getMessagesFromChat };
