import React, { useRef, useState } from "react";
// Components
import ChatLoading from "../loaders/ChatLoading";
import UserListItem from "../chat/UserListItem";

// Context
import { useChatContext } from "../../context/ChatProvider";
import { toastify } from "../../utils/notificationUtils";
// Chakra UI
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  Box,
  Spinner,
} from "@chakra-ui/react";

const SideDrawer = ({
  isOpen,
  onClose,
  searchUsers,
  searchValue,
  setSearchValue,
  searchResult,
  loading,
}) => {
  // Local states
  const [loadingChat, setLoadingChat] = useState(false);
  // Global state
  const { setSelectedChat, chats, setChats, config } = useChatContext();
  // Ref
  const btnRef = useRef();
  // Create chat that not excist or access chat that excist
  const createOrAccessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const res = await fetch(`/api/chat`, {
        method: "POST",
        ...config,
        body: JSON.stringify({ userId }),
      });
      const { chat } = await res.json();
      // If the chat doesnt excist
      if (!chats.find((item) => item._id === chat._id))
        setChats((prevChats) => [...prevChats, chat]);

      setSelectedChat(chat);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      toastify(err.message, "error", "top-left");
      setLoadingChat(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        {/* Drawer title */}
        <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
        {/* Drawer body */}
        <DrawerBody>
          <Box style={{ display: "flex" }} pb={2}>
            <Input
              placeholder="Search by user or email"
              mr={2}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button onClick={searchUsers} style={{ flex: "1" }}>
              Go
            </Button>
          </Box>
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => createOrAccessChat(user._id)}
              />
            ))
          )}
          {loadingChat && <Spinner ml="auto" style={{ display: "flex" }} />}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;
