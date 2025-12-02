import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import AllVenues from "./pages/AllVenues.jsx";
import VenueDetails from "./pages/VenueDetails.jsx";
import Profile from "./pages/Profile.jsx";
import CreateVenue from "./pages/CreateVenue.jsx";
import EditVenue from "./pages/EditVenue.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { RequireAuth, RequireManager } from "./components/RouteGuards.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AllVenues />} />
        <Route path="venue/:id" element={<VenueDetails />} />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="create-venue"
          element={
            <RequireManager>
              <CreateVenue />
            </RequireManager>
          }
        />
        <Route
          path="edit-venue/:id"
          element={
            <RequireManager>
              <EditVenue />
            </RequireManager>
          }
        />
        <Route
          path="booking/:id"
          element={
            <RequireAuth>
              <BookingForm />
            </RequireAuth>
          }
        />
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
