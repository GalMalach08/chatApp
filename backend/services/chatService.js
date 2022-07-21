const Chat = require("../db/models/chatModel");
const User = require("../db/models/userModel");

// Get the user that logged in and the id of the user we want to chat with-
// if chat excist return it if not create it
const createChat = async (user, id) => {
  try {
    let isChatExcist = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: user._id } } },
        { users: { $elemMatch: { $eq: id } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    let isChat = await User.populate(isChatExcist, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    if (isChat.length > 0) return isChat[0];
    else {
      const chat = await Chat.create({
        chatName: "sender",
        isGroupChat: false,
        users: [user._id, id],
      });

      const fullChat = await Chat.findById(chat._id).populate(
        "users",
        "-password"
      );
      return fullChat;
    }
  } catch (err) {
    throw new Error(err);
  }
};

// Get all the chats for specific user
const getChatsForUser = async (id) => {
  const chats = await Chat.find({
    users: { $elemMatch: { $eq: id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  const fullChats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (fullChats) return fullChats;
  else throw new Error("No chats found");
};

// Create group chat
const createGroupChat = async (body, adminId) => {
  try {
    const { chatName, users } = body;
    if (users.length < 3) {
      throw new Error("More than 2 users are required to form a group chat");
    }
    const groupChat = await Chat.create({
      chatName,
      isGroupChat: true,
      users,
      groupAdmin: adminId,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (fullGroupChat) return fullGroupChat;
    else throw new Error("Error with creating the chat");
  } catch (err) {
    throw new Error(err);
  }
};

// Change the name for excisting group
const renameChatGroup = async (body) => {
  try {
    const { chatId, chatName } = body;
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return chat;
  } catch (err) {
    throw new Error(err);
  }
};

// Remove user from group
const removeUserFromGroup = async (body) => {
  try {
    const { chatId, userId } = body;
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return chat;
  } catch (err) {
    throw new Error(err);
  }
};

// Add user to group
const addUserToGroup = async (body) => {
  try {
    const { chatId, userId } = body;
    const chat = await Chat.find({
      _id: chatId,
      users: { $elemMatch: { $eq: userId } },
    });
    if (chat.length > 0) throw new Error("The user already in the group");

    const newChat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (newChat) return newChat;
    else throw new Error("Chat not found");
  } catch (err) {
    throw new Error(err);
  }
};

// Update users in the group
const updateGroup = async (body) => {
  try {
    const { chatId, users, chatName } = body;

    const newChat = await Chat.findByIdAndUpdate(
      chatId,
      { users, chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (newChat) return newChat;
    else throw new Error("Chat not found");
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createChat,
  getChatsForUser,
  createGroupChat,
  renameChatGroup,
  removeUserFromGroup,
  addUserToGroup,
  updateGroup,
};
