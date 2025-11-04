import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import SearchBar from "./SearchBar.jsx";
import backgroundImage from "../assets/lake.jpg";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />

      {/* Hero section with background image and date picker */}
      <div
        className="w-full h-80 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <SearchBar />
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
