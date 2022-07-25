import React, { useEffect, useState } from "react";
// Components
import UpdateGroupModal from "../modals/UpdateGroupModal";
import ProfileModal from "../modals/ProfileModal";
// Utils
import { getFullSender, getSender } from "../../utils/chatUtils";
// Context
import { useChatContext } from "../../context/ChatProvider";
// React lottie
import Lottie from "lottie-react";
import animationData from "../../utils/6652-dote-typing-animation.json";
// Chakra UI
import {
  Box,
  Button,
  FormControl,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { AiFillEye } from "react-icons/ai";
import { toastify } from "../../utils/notificationUtils";
import ScrollableChat from "./ScrollableChat";
import { IoMdSend } from "react-icons/io";
import { GoPrimitiveDot } from "react-icons/go";

// Socket io
import io from "socket.io-client";
const ENDPOINT = "https://talk-a-tive-2022.herokuapp.com/";
let socket, selectedChatCompare, notificaionCompare;

// Shows single chat
const SingleChat = () => {
  // Local states
  const [messages, setMessages] = useState("");
  const [loading, setLoading] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // Global state
  const {
    user,
    selectedChat,
    setSelectedChat,
    config,
    setNotification,
    notification,
    setChats,
    setSocket,
    setConnectedUsers,
    connectedUsers,
  } = useChatContext();

  // Get all the users chats
  const getChats = async () => {
    try {
      const res = await fetch("/api/chat", {
        method: "GET",
        ...config,
      });
      const { chats } = await res.json();
      chats ? setChats(chats) : setChats([]);
    } catch (error) {
      toastify(
        "Error Occured!",
        "error",
        "bottom-left",
        "Failed to Load the chats, Try to refresh the page"
      );
    }
  };

  // Send the message and add to the database
  const sendMessage = async (e) => {
    try {
      if (e.key === "Enter" || e.type === "click") {
        socket.emit("stop typing", selectedChat._id);
        if (newMessage) {
          setNewMessage("");
          const res = await fetch("/api/message", {
            method: "POST",
            ...config,
            body: JSON.stringify({
              content: newMessage,
              chat: selectedChat._id,
            }),
          });
          const { message } = await res.json();
          setChats((prevState) =>
            prevState.map((chat) => {
              if (chat._id === message.chat._id) {
                return { ...chat, latestMessage: message };
              } else return chat;
            })
          );
          setMessages((prevState) => [...prevState, message]);
          await getChats();

          if (checkIfUserIsConnected(message.chat, connectedUsers)) {
            socket.emit("new message", message);
          } else {
            createNotificationForDisconnectUser(message);
          }
        } else {
          toastify("Please enter a message", "error");
        }
      }
    } catch (err) {
      toastify(err.message, "error");
    }
  };

  // Check if the user that recive the message is connected
  const checkIfUserIsConnected = (chat, connectedUsers) => {
    for (let i = 0; i < chat.users.length; i++) {
      for (let j = 0; j < connectedUsers.length; j++) {
        if (
          connectedUsers[j]._id === chat.users[i]._id &&
          connectedUsers[j]._id !== user._id
        ) {
          return true;
        }
      }
    }
    return false;
  };

  // Get all users message
  const getAllMessages = async () => {
    try {
      if (!selectedChat) return;
      setLoading(true);
      const res = await fetch(`/api/message?chatId=${selectedChat._id}`, {
        method: "GET",
        ...config,
      });
      const { chatMessages } = await res.json();
      setMessages(chatMessages);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      toastify(err.message, "error");
    }
  };

  // Check if the user is typing
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= 3000 && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, 3000);
  };

  // Create notification for unconnected users
  const createNotificationForDisconnectUser = async (newMessage) => {
    try {
      const userId = getFullSender(user, newMessage.chat.users)._id;
      const res = await fetch(`/api/notification/?userId=${userId}`, {
        method: "GET",
        ...config,
      });
      const { notifications } = await res.json();
      const notificationExcist = notifications.find(
        (noti) => noti.noti.chat._id === newMessage.chat._id
      );
      if (!notifications || !notificationExcist) {
        await fetch("/api/notification", {
          method: "POST",
          ...config,
          body: JSON.stringify({
            noti: newMessage._id,
            count: 1,
            user: userId,
          }),
        });
      } else {
        await fetch("/api/notification", {
          method: "PUT",
          ...config,
          body: JSON.stringify({
            notiId: notificationExcist._id,
          }),
        });
      }
    } catch (error) {
      toastify(
        "Error Occured!",
        "error",
        "bottom-left",
        "Failed to Load the notification, Try to refresh the page"
      );
    }
  };

  // Create notification for connected users
  const createNotification = async (newMessage) => {
    const notificationExcist = notificaionCompare.find(
      (noti) =>
        noti.noti.sender._id === newMessage.sender._id &&
        noti.noti.chat._id === newMessage.chat._id
    );
    if (notificationExcist) {
      // If the notification from this user is excist just increase the count by one
      const res = await fetch("/api/notification", {
        method: "PUT",
        ...config,
        body: JSON.stringify({
          notiId: notificationExcist._id,
        }),
      });
      const data = await res.json();
      setNotification(
        notificaionCompare.map((noti) => {
          if (
            data.notification.noti.sender._id === newMessage.sender._id &&
            noti.noti.chat._id === newMessage.chat._id
          ) {
            return data.notification;
          }
          return noti;
        })
      );
    } else {
      const res = await fetch("/api/notification", {
        method: "POST",
        ...config,
        body: JSON.stringify({
          noti: newMessage._id,
          count: 1,
          user: user._id,
        }),
      });
      const data = await res.json();
      setNotification([data.notification, ...notificaionCompare]); // else add the notification to the state
    }
  };

  // Socket io connection
  useEffect(() => {
    socket = io(ENDPOINT);
    setSocket(socket);
    socket.emit("setup", user);
    socket.on("connected", (connectedUsers) => {
      setConnectedUsers(connectedUsers);
      setSocketConnected(true);
    });
    socket.on("typing", (room) => {
      if (room === selectedChatCompare._id) setIsTyping(true);
    });
    socket.on("stop typing", () => setIsTyping(false));
    socket.on("message recived", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        // give notification
        createNotification(newMessage);
      } else {
        setMessages((prevState) => [...prevState, newMessage]);
      }
      getChats();
    });
    socket.on("disconnected", (connectedUsers) => {
      setConnectedUsers(connectedUsers);
    });
  }, []);

  useEffect(() => {
    getAllMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    notificaionCompare = notification;
  }, [notification]);

  return (
    <>
      {selectedChat ? (
        <>
          {/* If there is selected Chat */}
          <Text
            fontSize={{ base: "20px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <Box
                  display="flex"
                  flexDirection={{ base: "column", md: "row" }}
                  alignItems="center"
                >
                  {getSender(user, selectedChat.users).toUpperCase()}{" "}
                  {checkIfUserIsConnected(selectedChat, connectedUsers) ? (
                    <Text fontSize={{ base: "15px", md: "25px" }} m={[0, 3]}>
                      connected <Icon as={GoPrimitiveDot} color="green" />
                    </Text>
                  ) : (
                    <Text fontSize={{ base: "15px", md: "25px" }} m={[0, 3]}>
                      {" "}
                      disconnected <Icon as={GoPrimitiveDot} color="red" />
                    </Text>
                  )}
                </Box>

                <ProfileModal user={getFullSender(user, selectedChat.users)}>
                  <Button>
                    <Icon as={AiFillEye} w={6} h={6} />
                  </Button>
                </ProfileModal>
              </>
            ) : (
              <>
                <Box textAlign="center">
                  {selectedChat.chatName.toUpperCase()}
                </Box>

                <UpdateGroupModal>
                  <Button>
                    <Icon as={AiFillEye} w={6} h={6} />
                  </Button>
                </UpdateGroupModal>
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <>
                <div className="messages">
                  <ScrollableChat messages={messages} />
                </div>
              </>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping && (
                <div>
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    width={70}
                    className="lottie"
                  />
                </div>
              )}
              <InputGroup size="md">
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  onChange={typingHandler}
                  value={newMessage}
                />
                {newMessage && (
                  <InputRightElement
                    width="4.5rem"
                    cursor="pointer"
                    onClick={sendMessage}
                  >
                    <Icon as={IoMdSend} w={6} h={6} />
                  </InputRightElement>
                )}
              </InputGroup>
            </FormControl>
          </Box>
        </>
      ) : (
        <>
          {/* If there is not selected chat */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
          >
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
              Click on a user to start chatting
            </Text>
          </Box>
        </>
      )}
    </>
  );
};

export default SingleChat;
