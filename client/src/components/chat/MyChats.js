import React, { useEffect, useState } from "react";
// Components
import ChatLoading from "../loaders/ChatLoading";
import CreateGroupModal from "../modals/CreateGroupModal";
// Context
import { useChatContext } from "../../context/ChatProvider";
// Utils
import { getSender } from "../../utils/chatUtils";
import { toastify } from "../../utils/notificationUtils";
// Chakra UI
import { Badge, Box, Button, Stack, Text, Icon } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { GoPrimitiveDot } from "react-icons/go";
// Style
import "./styles.css";

// Chat list section off the app
const MyChats = () => {
  // Local state
  const [loggedUser, setloggeduser] = useState("");
  // Global state
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    config,
    setNotification,
    notification,
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

  // Get all users notifications on load
  const getNotifications = async () => {
    try {
      const res = await fetch(`/api/notification/?userId=${user._id}`, {
        method: "GET",
        ...config,
      });
      const { notifications } = await res.json();
      setNotification(notifications);
    } catch (error) {
      toastify(
        "Error Occured!",
        "error",
        "bottom-left",
        "Failed to Load the notification, Try to refresh the page"
      );
    }
  };

  // check if there is notifications and return them
  const isNotifications = (chatId) => {
    if (notification.length) {
      const notificationsMes = notification.find(
        (noti) => noti.noti.chat._id === chatId
      );
      if (notificationsMes) return notificationsMes.count;
      return false;
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

  // Select the chat
  const selectChat = async (chat) => {
    setSelectedChat(chat);
    const notiToDelete = notification.find(
      (item) => item.noti.chat._id === chat._id
    );
    if (notiToDelete) {
      setNotification((prevState) =>
        prevState.filter((item) => item.noti.chat._id !== chat._id)
      );
      await fetch("/api/notification", {
        method: "DELETE",
        ...config,
        body: JSON.stringify({
          notiId: notiToDelete._id,
        }),
      });
    }
  };

  // Activate the get chats func to get all the chats on page load
  useEffect(() => {
    setloggeduser(user);
    getChats();
    getNotifications();
  }, []);

  useEffect(() => {
    isNotifications();
  }, [notification]);

  return (
    <>
      <Box
        style={{
          flexDirection: "column",
          alignItems: "center",
        }}
        display={{
          base: selectedChat ? "none" : "flex",
          md: "flex",
        }}
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        {/* Section title */}
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "24px", md: "30px" }}
          fontFamily="Work sans"
          style={{ display: "flex", flexWrap: "wrap" }}
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats
          <CreateGroupModal>
            <Button
              d="flex"
              fontSize={{
                base: "17px",
                md: "10px",
                lg: "17px",
              }}
              rightIcon={<AddIcon w={3} h={3} />}
              mt={1}
            >
              New Group Chat
            </Button>
          </CreateGroupModal>
        </Box>

        {/* List of all the chats */}
        <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="scroll"
        >
          {chats ? (
            chats.length > 0 ? (
              <Stack overflowY="scroll">
                {chats.map((chat) => (
                  <Box
                    onClick={() => {
                      selectChat(chat);
                    }}
                    cursor="pointer"
                    bg={selectedChat._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat._id === chat._id ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    h="70px"
                  >
                    <Box display="flex" justifyContent="space-between">
                      {/* Chat name */}
                      <Text>
                        {!chat.isGroupChat
                          ? getSender(loggedUser, chat.users)
                          : chat.chatName}
                      </Text>
                      <Text>
                        {isNotifications(chat._id) && (
                          <Badge
                            colorScheme="green"
                            variant="solid"
                            className="badge_alert inner_badge"
                          >
                            {isNotifications(chat._id)}
                          </Badge>
                        )}
                      </Text>
                    </Box>

                    {/* Chat latest message */}
                    {chat.latestMessage && (
                      <Box display="flex" justifyContent="space-between">
                        <Text fontSize="xs">
                          <b>{chat.latestMessage.sender.name} : </b>
                          {chat.latestMessage.content.length > 50
                            ? chat.latestMessage.content.substring(0, 51) +
                              "..."
                            : chat.latestMessage.content}
                        </Text>
                        {!chat.isGroupChat && (
                          <Text fontSize="xs">
                            {checkIfUserIsConnected(chat, connectedUsers) ? (
                              <span>
                                connected{" "}
                                <Icon as={GoPrimitiveDot} color="green" />
                              </span>
                            ) : (
                              <span>
                                {" "}
                                disconnected{" "}
                                <Icon as={GoPrimitiveDot} color="red" />
                              </span>
                            )}
                          </Text>
                        )}
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            ) : (
              <div>No chats available</div>
            )
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
