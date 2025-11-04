import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AllVenues from "./pages/AllVenues.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<AllVenues />} />
      </Route>
    </Routes>
  );
}
