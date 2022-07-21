import React from "react";
import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { useChatContext } from "../../context/ChatProvider";
import { Button, Icon } from "@chakra-ui/react";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useChatContext();

  return (
    <Box
      className="chatbox"
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      {/* Section title */}
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "24px", md: "30px" }}
        fontFamily="Work sans"
        style={{ display: "flex", flexWrap: "wrap" }}
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      ></Box>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
