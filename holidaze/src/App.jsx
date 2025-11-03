import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={<h1 className="text-3xl font-bold">Welcome to Holidaze</h1>}
        />
        <Route
          path="about"
          element={<h1 className="text-3xl font-bold">About Us</h1>}
        />
        <Route
          path="contact"
          element={<h1 className="text-3xl font-bold">Contact Us</h1>}
        />
      </Route>
    </Routes>
  );
}
