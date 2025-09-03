import { Routes, Route, Link } from "react-router-dom";
import App from "./App";
import DeletedMessagesPage from "./DeletedMessagesPage";

export default function Navi() {
  return (
    <>
      <nav>
        <Link to="/">Chat</Link>
        <Link to="/deleted">Deleted Messages</Link>
      </nav>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/deleted" element={<DeletedMessagesPage />} />
      </Routes>
    </>
  );
}