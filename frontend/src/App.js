import "./App.css";
import { Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import { createStandaloneToast } from "@chakra-ui/toast";

const { ToastContainer } = createStandaloneToast();

function App() {
  return (
    <div className="App">
      <Route path="/chats" component={ChatPage} />
      <Route path="/" component={HomePage} exact />
      <ToastContainer />
    </div>
  );
}

export default App;
