import "./App.css";
import { Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <div className="App">
      <Route path="/chats" component={ChatPage} />
      <Route path="/" component={HomePage} exact />
    </div>
  );
}

export default App;
