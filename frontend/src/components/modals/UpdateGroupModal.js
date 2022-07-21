import React, { useEffect, useState } from "react";
// Components
import UserListItem from "../chat/UserListItem";
// Utils
import { config, UserBadgeItem } from "../../utils/userUtils";
import { toastify } from "../../utils/notificationUtils";
// Context
import { useChatContext } from "../../context/ChatProvider";
// Chakra UI
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  Input,
  Box,
  FormControl,
} from "@chakra-ui/react";

// Modal that allowed to update excisting group
const UpdateGroupModal = ({ children }) => {
  // Local states
  const [chatName, setChatName] = useState("");
  const [userInGroup, setUserInGroup] = useState("");
  const [usersOptions, setUsersOptions] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [usersInGroup, setUsersInGroup] = useState([]);
  const [loading, setLoading] = useState(false);
  // Global states
  const { selectedChat, setChats, setSelectedChat, user } = useChatContext();
  // Modal disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();

  // delete user badge
  const deleteUserFromGroup = (userId) => {
    // If the logged in user is not the admin
    if (selectedChat.groupAdmin._id !== user._id)
      return toastify("Only admins can delete fron the group", "error");
    setUsersInGroup((prevState) =>
      prevState.filter((item) => item._id !== userId)
    );
  };

  // Search for all the users that match the search value
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
      setLoading(false);
    }
  };

  // Update the group in the database
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
      toastify("Group has been updated successfully", "success");
    } catch (err) {
      console.log(err);
    }
  };
  const addUserToGroup = (user) => {
    const isInGroup = usersInGroup.find((item) => item._id === user._id);
    if (isInGroup) {
      toastify("You already added the user to the group", "error");
    } else setUsersInGroup((prevState) => [...prevState, user]);
  };

  // Close the modal
  const closeModal = () => {
    setUsersInGroup(selectedChat.users);
    onClose();
  };

  // Update the database that the connected user left the group
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
      toastify("You leaved the group successfully", "success");
    } catch (err) {
      setDeleteLoading(false);
    }
  };

  // Runs every time the selected chat changed to reset the values
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
          {/* Modal title- chat name */}
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            style={{ display: "flex" }}
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />

          {/* Modal Body */}
          <ModalBody
            style={{ display: "flex" }}
            flexDir="column"
            alignItems="center"
          >
            <Box w="100%" my={3}>
              {/* Chat name */}
              <FormControl mb={3}>
                <Input
                  value={chatName}
                  type="text"
                  placeholder="Chat Name"
                  onChange={(e) => setChatName(e.target.value)}
                />
              </FormControl>

              {/* Users */}
              <FormControl>
                <Input
                  isDisabled={
                    user._id === selectedChat.groupAdmin._id ? false : true
                  }
                  value={userInGroup}
                  type="text"
                  placeholder="Add Users eg: John,Gal"
                  onChange={searchUsers}
                />
              </FormControl>
            </Box>

            {/* Users that added to the group */}
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

            {/* Users that match the search */}
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

          {/* Modal footer */}
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
