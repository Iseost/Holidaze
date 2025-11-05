import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = false; // Replace with actual authentication logic
  const isVenueManager = false; // Replace with actual user role check

  return (
    <header className="rounded-b-lg shadow-[0_4px_10px_rgba(0,0,0,0.25)] p-4">
      <div className="container mx-auto flex justify-around ">
        <Link to="/">
          <img
            src={logo}
            alt="Holidaze logo"
            className="w-24 h-24 border rounded-full border-[var(--text-body)]"
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
              <span className="block w-6 h-0.5 bg-[var(--text-body)]"></span>
              <span className="block w-6 h-0.5 bg-[var(--text-body)]"></span>
              <span className="block w-6 h-0.5 bg-[var(--text-body)]"></span>
            </button>

            {/* Menu overlay */}
            {isMenuOpen && (
              <div
                className="fixed inset-0 z-50 flex justify-end"
                onClick={() => setIsMenuOpen(false)}
              >
                {/* Menu Panel */}
                <nav
                  className="w-64 h-full bg-[var(--bg-header)] shadow-lg p-6 relative"
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
                    {isVenueManager ? (
                      <>
                        {/* Venue Manager Menu */}
                        <li>
                          <Link
                            to="/profile"
                            className="hover:underline block font-bold"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Your Profile
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/add-venue"
                            className="hover:underline block font-bold"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Add a new venue
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              // Implement logout logic here
                              setIsMenuOpen(false);
                            }}
                            className="hover:underline font-bold"
                          >
                            Log out
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        {/* Customer Menu */}
                        <li>
                          <Link
                            to="/profile"
                            className="hover:underline block font-bold"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Your Profile/ Bookings
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              // Implement logout logic here
                              setIsMenuOpen(false);
                            }}
                            className="hover:underline font-bold"
                          >
                            Log out
                          </button>
                        </li>
                      </>
                    )}
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
