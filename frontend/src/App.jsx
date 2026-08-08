import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyLinks from "./pages/MyLinks";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/my-links" element={<MyLinks />} />
      <Route path="/analytics/:id" element={<Analytics />} />
    </Routes>
  );
}

export default App;