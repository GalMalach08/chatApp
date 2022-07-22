const Chat = require("../db/models/chatModel");
const Message = require("../db/models/messageModel");
const User = require("../db/models/userModel");

// Send message
const sendMessage = async (body, sender) => {
  try {
    const { content, chat, readBy } = body;
    console.log(chat);
    let message = await Message.create({ sender, content, chat, readBy });
    message = await Message.findById(message._id)
      .populate("sender", "-password")
      .populate("chat")
      .populate("readBy");

    const fullMessage = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    // Update the chat latest message
    const latestMessage = await Chat.findByIdAndUpdate(chat, {
      latestMessage: fullMessage._id,
    });

    if (fullMessage) return { fullMessage, latestMessage };
    else throw new Error("Error occured, message didnt uploaded");
  } catch (err) {
    throw new Error(err);
  }
};

// Get all messages from praticular chat
const getMessagesFromChat = async (chatId) => {
  try {
    const chatMessages = await Message.find({
      chat: chatId,
    })
      .populate("sender", "-password")
      .populate("chat")
      .populate("readBy");
    if (chatMessages) return chatMessages;
    else throw new Error("Error occured, messages not found");
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = { sendMessage, getMessagesFromChat };
