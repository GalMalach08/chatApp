import React, { useState } from "react";
// Components
import UserListItem from "../chat/UserListItem";
// Utils
import { UserBadgeItem } from "../../utils/userUtils";
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
  Spinner,
  Input,
  Box,
  FormControl,
} from "@chakra-ui/react";

// Modal that allowed to create new group
const CreateGroupModal = ({ children }) => {
  // Local states
  const [chatName, setChatName] = useState("");
  const [userInGroup, setUserInGroup] = useState("");
  const [usersInGroup, setUsersInGroup] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  // Global states
  const { user, setSelectedChat, setChats, config } = useChatContext();
  // Modal disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      console.log(err);
      setLoading(false);
    }
  };

  // Add user to the group's users list
  const addUserToGroup = (user) => {
    const isInGroup = usersInGroup.find((item) => item._id === user._id);
    if (isInGroup) {
      toastify("You already added this user to the group", "error");
    } else setUsersInGroup((prevState) => [...prevState, user]);
  };

  // Delete user from the group's users list
  const deleteUserFromGroup = (userId) => {
    setUsersInGroup((prevState) =>
      prevState.filter((item) => item._id !== userId)
    );
  };

  // Create the group in the data base
  const createGroup = async () => {
    try {
      setLoading(true);
      if (usersInGroup.length < 2) {
        toastify("You Need minimum 3 users to create a group", "error");
      } else {
        const users = usersInGroup.map((item) => item._id);
        users.push(user._id);
        const res = await fetch(`/api/chat/group`, {
          method: "POST",
          ...config,
          body: JSON.stringify({ chatName, users }),
        });
        const { chat } = await res.json();
        setSelectedChat(chat);
        setChats((prevState) => [...prevState, chat]);
        onClose();
        toastify("The chat has created", "success");
        setLoading(false);
        setChatName("");
        setUsersInGroup([]);
      }
    } catch (err) {
      toastify(err.message, "error");
      setLoading(false);
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          {/* Modal title */}
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            style={{ display: "flex" }}
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />

          {/* Modal Body */}
          <ModalBody
            style={{ display: "flex" }}
            flexDir="column"
            alignItems="center"
          >
            {/* Chat name */}
            <FormControl isRequired m={1}>
              <Input
                value={chatName}
                type="text"
                placeholder="Chat Name"
                onChange={(e) => setChatName(e.target.value)}
              />
            </FormControl>

            {/* Users */}
            <FormControl isRequired m={1}>
              <Input
                value={userInGroup}
                type="text"
                placeholder="Add Users eg: John,Gal"
                onChange={searchUsers}
              />
            </FormControl>

            {/* Users that added to the group */}
            {loading && <Spinner m={2} />}
            <Box w="100%" d="flex" flexWrap="wrap">
              {usersInGroup.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  badgeUser={user}
                  handleFunction={() => deleteUserFromGroup(user._id)}
                  admin={false}
                />
              ))}
            </Box>

            {/* Users that match the search */}
            <Box
              w="100%"
              h={usersOptions.length > 3 ? "250px" : ""}
              overflow="scroll"
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
          <ModalFooter>
            <Button
              isDisabled={!chatName || usersInGroup.length < 1 ? true : false}
              colorScheme="blue"
              onClick={createGroup}
              isLoading={loading}
              m="auto"
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateGroupModal;
