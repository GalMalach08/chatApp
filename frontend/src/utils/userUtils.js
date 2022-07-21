import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import { useChatContext } from "../context/ChatProvider";
const user = JSON.parse(localStorage.getItem("user")) || {};
export const config = {
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${user.token} `,
  },
};

export const UserBadgeItem = ({ badgeUser, handleFunction, admin }) => {
  const { user } = useChatContext();
  return (
    <Badge
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor={admin === user._id && admin !== badgeUser._id && "pointer"}
      onClick={handleFunction}
    >
      {user.name}
      {admin === badgeUser._id && <span> (Admin)</span>}
      {admin === user._id ? (
        badgeUser._id !== user._id ? (
          <CloseIcon pl={1} />
        ) : null
      ) : null}
    </Badge>
  );
};
