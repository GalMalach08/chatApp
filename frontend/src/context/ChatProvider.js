import { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();
export const useChatContext = () => useContext(ChatContext);

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [selectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState();
  const [config, setConfig] = useState({
    headers: { "Content-type": "application/json" },
  });
  const history = useHistory();

  const logOutUser = () => {
    setUser("");
    setSelectedChat("");
    setChats("");
    localStorage.removeItem("user");
  };

  const setUserState = (userState) => setUser(userState);

  const setConfigHeaders = (token) => {
    setConfig({
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token} `,
      },
    });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      history.push("/");
    } else {
      setUser(user);
      setConfigHeaders(user.token);
    }
  }, [history]);

  return (
    <ChatContext.Provider
      value={{
        user,
        logOutUser,
        setSelectedChat,
        selectedChat,
        chats,
        setUserState,
        setChats,
        config,
        setConfigHeaders,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
