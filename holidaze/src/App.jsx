import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AllVenues from "./pages/AllVenues.jsx";
import VenueDetails from "./pages/VenueDetails.jsx";
import Profile from "./pages/Profile.jsx";
import CreateVenue from "./postActions/createVenue.jsx";
import EditVenue from "./postActions/EditVenue.jsx";
import BookingForm from "./components/BookingForm.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AllVenues />} />
        <Route path="venue/:id" element={<VenueDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="create-venue" element={<CreateVenue />} />
        <Route path="edit-venue/:id" element={<EditVenue />} />
        <Route path="booking/:id" element={<BookingForm />} />
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
