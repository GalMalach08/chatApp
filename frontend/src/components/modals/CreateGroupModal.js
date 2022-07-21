import React, { useEffect, useState } from "react";
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
import { ViewIcon } from "@chakra-ui/icons";
import { config, UserBadgeItem } from "../../utils/userUtils";
import UserListItem from "../chat/UserListItem";
import { useChatContext } from "../../context/ChatProvider";

const CreateGroupModal = ({ children }) => {
  const [chatName, setChatName] = useState("");
  const [userInGroup, setUserInGroup] = useState("");
  const [usersInGroup, setUsersInGroup] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setSelectedChat, setChats } = useChatContext();
  const toast = useToast();

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

  const createGroup = async () => {
    try {
      setLoading(true);
      if (usersInGroup.length < 2) {
        toast({
          title: "You Need minimum 3 users to create a group",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
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
        toast({
          title: "The chat has created",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        setChatName("");
        setUsersInGroup([]);
      }
    } catch (err) {
      toast({
        title: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const deleteUserFromGroup = (userId) => {
    setUsersInGroup((prevState) =>
      prevState.filter((item) => item._id !== userId)
    );
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            style={{ display: "flex" }}
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            style={{ display: "flex" }}
            flexDir="column"
            alignItems="center"
          >
            <FormControl isRequired m={1}>
              <Input
                value={chatName}
                type="email"
                placeholder="Chat Name"
                onChange={(e) => setChatName(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired m={1}>
              <Input
                value={userInGroup}
                type="email"
                placeholder="Add Users eg: John,Gal"
                onChange={searchUsers}
              />
            </FormControl>

            {loading && "loading..."}
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
