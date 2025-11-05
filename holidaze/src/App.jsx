import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AllVenues from "./pages/AllVenues.jsx";
import VenueDetails from "./pages/VenueDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AllVenues />} />
        <Route path="venue/:id" element={<VenueDetails />} />
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
