import React from "react";
// Chakra UI
import { Skeleton, Stack } from "@chakra-ui/react";

// Skeleton loader
const ChatLoading = () => {
  return (
    <Stack>
      {[...Array(10).keys()].map((item) => (
        <Skeleton height="45px" key={item} />
      ))}
    </Stack>
  );
};

export default ChatLoading;
