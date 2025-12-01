//header.jsx

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storeUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storeUser);
  }, []);

  const isLoggedIn = !!user;
  const isVenueManager = user?.venueManager || false;

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 z-50 left-0 w-full rounded-b-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] p-4">
      <div className="container mx-auto flex justify-around ">
        <Link
          to="/"
          onClick={() => {
            window.scrollTo(0, 0);
            window.location.href = "/";
          }}
        >
          <img
            src={logo}
            alt="Holidaze logo"
            className="w-24 h-24 border rounded-full border-(--text-body)"
          />
        </Link>

        {isLoggedIn ? (
          <>
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col gap-1 p-2 relative mt-16"
              aria-label="Toggle menu"
            >
              <span className="block w-6 h-0.5 bg-(--text-body)"></span>
              <span className="block w-6 h-0.5 bg-(--text-body)"></span>
              <span className="block w-6 h-0.5 bg-(--text-body)"></span>
            </button>

            {/* Menu overlay */}
            {isMenuOpen && (
              <div
                className="fixed inset-0 z-50 flex justify-end"
                onClick={() => setIsMenuOpen(false)}
              >
                {/* Menu Panel */}
                <nav
                  className="w-64 h-full bg-(--bg-header) shadow-lg p-6 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="absolute top-4 right-4 text-3xl leading-none"
                    aria-label="Close menu"
                  >
                    ×
                  </button>
                  <ul className="flex flex-col space-y-4 mt-12">
                    {/* Profile Link - Same for both */}
                    <li>
                      <Link
                        to="/profile"
                        className="hover:underline block font-bold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {isVenueManager
                          ? "Your Profile"
                          : "Your Profile / Bookings"}
                      </Link>
                    </li>

                    {/* Add Venue - Only for Venue Managers */}
                    {isVenueManager && (
                      <li>
                        <Link
                          to="/create-venue"
                          className="hover:underline block font-bold"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Add a new venue
                        </Link>
                      </li>
                    )}

                    {/* Logout - Same for both */}
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="hover:underline font-bold text-left"
                      >
                        Log out
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </>
        ) : (
          <nav>
            <ul className="flex space-x-4 mt-16">
              <li>
                <Link
                  to="/login"
                  className="hover:underline text-[var(--text-body)] font-bold"
                >
                  Log in
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
