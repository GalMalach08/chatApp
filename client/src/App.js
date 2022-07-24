import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { createStandaloneToast } from "@chakra-ui/toast";

const { ToastContainer } = createStandaloneToast();

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default App;
