import { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();
export const useChatContext = () => useContext(ChatContext);

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [selectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState([]);
  const history = useHistory();

  const setUserState = (userState) => setUser(userState);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return history.push("/");
    }
    setUser(user);
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUserState,
        setSelectedChat,
        selectedChat,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
