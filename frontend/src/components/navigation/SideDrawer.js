import React, { useRef, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  Input,
  Box,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import ChatLoading from "../loaders/ChatLoading";
import UserListItem from "../chat/UserListItem";
import { config } from "../../utils/userUtils";
import { useChatContext } from "../../context/ChatProvider";

const SideDrawer = ({
  isOpen,
  onClose,
  searchUsers,
  searchValue,
  setSearchValue,
  searchResult,
  loading,
}) => {
  const [loadingChat, setLoadingChat] = useState(false);
  const { setSelectedChat, chats, setChats } = useChatContext();
  const toast = useToast();
  const btnRef = useRef();

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
      toast({
        title: err.message,
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
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
        <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

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
