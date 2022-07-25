import React, { useEffect } from "react";
import { useChatContext } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import Header from "../components/navigation/Header";
import MyChats from "../components/chat/MyChats";
import ChatBox from "../components/chat/ChatBox";
import { toastify } from "../utils/notificationUtils";
const ChatPage = () => {
  // Global state

  const { user } = useChatContext();

  useEffect(() => {}, []);

  return (
    <div style={{ width: "100%" }}>
      {user && <Header />}
      <Box
        style={{ display: "flex" }}
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
