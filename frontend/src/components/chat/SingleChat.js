import React from "react";
// Components
import UpdateGroupModal from "../modals/UpdateGroupModal";
import ProfileModal from "../modals/ProfileModal";
// Utils
import { getFullSender, getSender } from "../../utils/chatUtils";
// Context
import { useChatContext } from "../../context/ChatProvider";
// Chakra UI
import { Box, Button, Icon, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { AiFillEye } from "react-icons/ai";

// Shows single chat
const SingleChat = () => {
  // Global state
  const { user, selectedChat, setSelectedChat } = useChatContext();

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
            Messages here
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
