import React, { useEffect } from "react";

const ChatPage = () => {
  const fetchPosts = async () => {
    const res = await fetch("/api/chat");
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return <div>Chat</div>;
};

export default ChatPage;
