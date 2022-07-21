import React, { useContext, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Button,
  Image,
  Text,
  useToast,
  Input,
  Box,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";
import { config, UserBadgeItem } from "../../utils/userUtils";
import UserListItem from "../chat/UserListItem";
import { useChatContext } from "../../context/ChatProvider";

const UpdateGroupModal = ({ children }) => {
  const [chatName, setChatName] = useState("");
  const [userInGroup, setUserInGroup] = useState("");
  const [usersOptions, setUsersOptions] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { selectedChat, setChats, setSelectedChat, user } = useChatContext();
  const [usersInGroup, setUsersInGroup] = useState([]);

  const deleteUserFromGroup = (userId) => {
    // If the logged in user is not the admin
    if (selectedChat.groupAdmin._id !== user._id) {
      return toast({
        title: "Only admins can delete fron the group",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
    setUsersInGroup((prevState) =>
      prevState.filter((item) => item._id !== userId)
    );
  };

  const searchUsers = async (e) => {
    try {
      setLoading(true);
      setUserInGroup(e.target.value);
      if (e.target.value === "") setUsersOptions([]);
      else {
        const res = await fetch(`/api/user/?search=${e.target.value}`, {
          method: "GET",
          ...config,
        });
        const { users } = await res.json();
        e.target.value !== "" && setUsersOptions(users);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const updateGroup = async () => {
    try {
      setLoading(true);
      // Update the users in the chat
      const res = await fetch(`/api/chat/group`, {
        method: "PUT",
        ...config,
        body: JSON.stringify({
          users: usersInGroup,
          chatName,
          chatId: selectedChat._id,
        }),
      });
      const { chat } = await res.json();
      setChats((prevState) =>
        prevState.map((item) => {
          if (item._id === chat._id) return chat;
          return item;
        })
      );
      setSelectedChat(chat);
      setLoading(false);
      closeModal();
      toast({
        title: "Group has been updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      console.log(err);
    }
  };
  const addUserToGroup = (user) => {
    const isInGroup = usersInGroup.find((item) => item._id === user._id);
    if (isInGroup) {
      toast({
        title: "You added the user to the group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } else setUsersInGroup((prevState) => [...prevState, user]);
  };

  const closeModal = () => {
    setUsersInGroup(selectedChat.users);
    onClose();
  };

  const leaveGroup = async () => {
    try {
      setDeleteLoading(true);
      const users = usersInGroup.filter((item) => item._id !== user._id);
      await fetch(`/api/chat/group`, {
        method: "PUT",
        ...config,
        body: JSON.stringify({
          users,
          chatName,
          chatId: selectedChat._id,
        }),
      });
      setChats((prevState) =>
        prevState.filter((item) => item._id !== selectedChat._id)
      );
      setDeleteLoading(false);
      setSelectedChat("");
      closeModal();
      toast({
        title: "You leaved the group successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (err) {
      console.log(err);
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      setUsersInGroup(selectedChat.users);
      setChatName(selectedChat.chatName);
    }
  }, [selectedChat]);

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal size="lg" onClose={closeModal} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            style={{ display: "flex" }}
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            style={{ display: "flex" }}
            flexDir="column"
            alignItems="center"
          >
            {/* {loading && "loading..."} */}

            <Box w="100%" my={3}>
              <FormControl mb={3}>
                <Input
                  value={chatName}
                  type="email"
                  placeholder="Chat Name"
                  onChange={(e) => setChatName(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <Input
                  isDisabled={
                    user._id === selectedChat.groupAdmin._id ? false : true
                  }
                  value={userInGroup}
                  type="email"
                  placeholder="Add Users eg: John,Gal"
                  onChange={searchUsers}
                />
              </FormControl>
            </Box>
            <Box w="100%" d="flex" flexWrap="wrap">
              {usersInGroup.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  badgeUser={user}
                  handleFunction={() => deleteUserFromGroup(user._id)}
                  admin={selectedChat.groupAdmin._id}
                />
              ))}
            </Box>

            <Box
              w="100%"
              overflow="scroll"
              h={usersOptions.length > 3 ? "250px" : ""}
            >
              {usersOptions.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => addUserToGroup(user)}
                />
              ))}
            </Box>
          </ModalBody>
          <ModalFooter display="flex" justifyContent="space-around">
            <Button
              isDisabled={!chatName || usersInGroup.length < 1 ? true : false}
              h={10}
              w={40}
              onClick={updateGroup}
              colorScheme="green"
              isLoading={loading}
            >
              Update
            </Button>
            <Button
              isLoading={deleteLoading}
              h={10}
              w={40}
              colorScheme="red"
              onClick={leaveGroup}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupModal;
