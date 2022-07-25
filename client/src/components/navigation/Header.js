import React, { useState } from "react";
// React router dom
import { useNavigate } from "react-router-dom";
// Components
import ProfileModal from "../modals/ProfileModal";
import SideDrawer from "./SideDrawer";
// Utils
import { toastify } from "../../utils/notificationUtils";
import { getSender } from "../../utils/chatUtils";
// Context
import { useChatContext } from "../../context/ChatProvider";
// Chakra UI
import {
  Button,
  useDisclosure,
  Tooltip,
  Icon,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Badge,
} from "@chakra-ui/react";
import { SearchIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { MdWhatshot } from "react-icons/md";
// Style
import "./style.css";

// The header of the app
const Header = () => {
  // Local states
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  // Global states
  const {
    user,
    logOutUser,
    config,
    setSelectedChat,
    notification,
    setNotification,
  } = useChatContext();
  // Utils
  const navigate = useNavigate();
  // Modal disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Search for all the users that match the search value
  const searchUsers = async () => {
    try {
      setLoading(true);
      if (searchValue.length < 2) {
        setLoading(false);
        toastify("Enter Minimum 2 characters", "warning", "top-left");
      }
      const res = await fetch(`/api/user/?search=${searchValue}`, {
        method: "GET",
        ...config,
      });
      const { users } = await res.json();
      setSearchResult(users);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // Handle the click on notifications
  const notificationClick = (chat, notif) => {
    setSelectedChat(chat);
    setNotification((prevState) =>
      prevState.filter((item) => item.noti !== notif)
    );
  };

  const sumNotifications = () =>
    notification.reduce(
      (accumulator, current) => accumulator + current.count,
      0
    );

  // Logout the user
  const logOut = () => {
    logOutUser();
    navigate("/");
  };

  return (
    <>
      <Box
        style={{ display: "flex" }}
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        {/* Left side of the header */}
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <Icon>
              <SearchIcon />
            </Icon>
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search user
            </Text>
          </Button>
        </Tooltip>

        {/* Header title */}
        <Text
          fontSize="2xl"
          fontFamily="Work sans"
          display="flex"
          alignItems="center"
        >
          <span> Talk-A-Tive</span>
          <Icon as={MdWhatshot} w={6} h={6} mx={3} />
        </Text>

        {/* Right side of the header */}
        <div>
          {/* notification button */}
          <Menu>
            <MenuButton p={1} mr={3} style={{ position: "relative" }}>
              <BellIcon fontSize="3xl" m={1} />
              {notification.length !== 0 && (
                <Badge
                  colorScheme="green"
                  variant="solid"
                  className="alert_badge"
                >
                  {sumNotifications()}
                </Badge>
              )}
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length
                ? "No new messages"
                : notification.map((notif) => (
                    <span key={notif._id}>
                      <MenuItem
                        onClick={() =>
                          notificationClick(notif.noti.chat, notif.noti)
                        }
                      >
                        <div>
                          {notif.noti.chat.isGroupChat
                            ? `New message from ${notif.noti.chat.chatName}`
                            : `New message from ${getSender(
                                user,
                                notif.noti.chat.users
                              )} `}
                        </div>

                        <Badge
                          colorScheme="green"
                          variant="solid"
                          className="alert_badge inner_badge"
                        >
                          {" "}
                          {notif.count}
                        </Badge>
                      </MenuItem>
                      <MenuDivider />
                    </span>
                  ))}
            </MenuList>
          </Menu>

          <Menu>
            {/* Account button */}
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon fontSize="2xl" m={1} />}
              p={1}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logOut}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>

        {/* SideDrawer component */}
        <SideDrawer
          isOpen={isOpen}
          onClose={onClose}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          searchUsers={searchUsers}
          searchResult={searchResult}
          loading={loading}
        />
      </Box>
    </>
  );
};

export default Header;
