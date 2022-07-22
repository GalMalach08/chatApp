import React, { useState } from "react";
// React router dom
import { useHistory } from "react-router-dom";
// Components
import ProfileModal from "../modals/ProfileModal";
import SideDrawer from "./SideDrawer";
// Utils
import { toastify } from "../../utils/notificationUtils";
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
} from "@chakra-ui/react";
import { SearchIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";

// The header of the app
const Header = () => {
  // Local states
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  // Global states
  const { user, logOutUser, config } = useChatContext();
  // Utils
  const history = useHistory();
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

  // Logout the user
  const logOut = () => {
    logOutUser();
    history.push("/");
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
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>

        {/* Right side of the header */}
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList></MenuList>
          </Menu>

          {/* Account button */}
          <Menu>
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
