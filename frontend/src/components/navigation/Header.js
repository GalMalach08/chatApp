import React, { useState, useRef } from "react";
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
  useToast,
  Avatar,
} from "@chakra-ui/react";
import { SearchIcon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons";

import { config } from "../../utils/userUtils";
import { useChatContext } from "../../context/ChatProvider";
import ProfileModal from "../modals/ProfileModal";
import { useHistory } from "react-router-dom";
import SideDrawer from "./SideDrawer";

const Header = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, setUserState } = useChatContext();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const searchUsers = async () => {
    try {
      setLoading(true);
      if (searchValue.length < 2) {
        setLoading(false);
        return toast({
          title: "Enter Minimum 2 characters",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top-left",
        });
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

  const logOut = () => {
    setUserState("");
    history.push("/");
    localStorage.removeItem("user");
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
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList></MenuList>
          </Menu>
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
