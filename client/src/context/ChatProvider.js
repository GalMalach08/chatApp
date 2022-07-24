import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();
export const useChatContext = () => useContext(ChatContext);

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [selectedChat, setSelectedChat] = useState("");
  const [chats, setChats] = useState();
  const [notification, setNotification] = useState([]);
  const [config, setConfig] = useState({
    headers: { "Content-type": "application/json" },
  });
  const navigate = useNavigate();

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
      navigate("/");
    } else {
      setUser(user);
      setConfigHeaders(user.token);
    }
  }, [navigate]);

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
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
