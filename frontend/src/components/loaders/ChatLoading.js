import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <Stack>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <Skeleton height="45px" key={item} />
      ))}
    </Stack>
  );
};

export default ChatLoading;
