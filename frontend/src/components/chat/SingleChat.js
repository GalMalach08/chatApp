import React, { useEffect, useState } from "react";
// Components
import UpdateGroupModal from "../modals/UpdateGroupModal";
import ProfileModal from "../modals/ProfileModal";
// Utils
import { getFullSender, getSender } from "../../utils/chatUtils";
// Context
import { useChatContext } from "../../context/ChatProvider";
// Chakra UI
import {
  Box,
  Button,
  FormControl,
  Icon,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { AiFillEye } from "react-icons/ai";
import { toastify } from "../../utils/notificationUtils";
import ScrollableChat from "./ScrollableChat";

// Shows single chat
const SingleChat = () => {
  // Local states
  const [messages, setMessages] = useState("");
  const [loading, setLoading] = useState("");
  const [newMessage, setNewMessage] = useState("");
  // Global state
  const { user, selectedChat, setSelectedChat, config } = useChatContext();

  // Send the message and add to the database
  const sendMessage = async (e) => {
    try {
      if (e.key === "Enter") {
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
          setNewMessage("");
          setMessages((prevState) => [...prevState, message]);
        } else {
          toastify("Please enter a message", "error");
        }
      }
    } catch (err) {
      toastify(err.message, "error");
    }
  };

  const getAllMessages = async () => {
    try {
      if (!selectedChat) return;
      setLoading(true);
      console.log(selectedChat);
      const res = await fetch(`/api/message?chatId=${selectedChat._id}`, {
        method: "GET",
        ...config,
      });
      const { chatMessages } = await res.json();
      setMessages(chatMessages);
      setLoading(false);
    } catch (err) {
      toastify(err.message, "error");
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing indicator logic
  };

  useEffect(() => {
    getAllMessages();
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          {/* If there is selected Chat */}
          <Text
            fontSize={{ base: "28px", md: "30px" }}
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
                {getSender(user, selectedChat.users).toUpperCase()}
                <ProfileModal user={getFullSender(user, selectedChat.users)}>
                  <Button>
                    <Icon as={AiFillEye} w={6} h={6} />
                  </Button>
                </ProfileModal>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
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
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
              />
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
