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
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

// Chat list section off the app
const MyChats = () => {
  const [loggedUser, setloggeduser] = useState("");
  const { selectedChat, setSelectedChat, user, chats, setChats, config } =
    useChatContext();

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

  // Activate the get chats func to get all the chats on page load
  useEffect(() => {
    setloggeduser(user);
    getChats();
  }, []);

  return (
    <>
      <Box
        style={{
          flexDirection: "column",
          alignItems: "center",
        }}
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
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
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
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
                    onClick={() => setSelectedChat(chat)}
                    cursor="pointer"
                    bg={selectedChat._id === chat._id ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat._id === chat._id ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    {/* Chat name */}
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                    {/* Chat latest message */}
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>{chat.latestMessage.sender.name} : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
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
