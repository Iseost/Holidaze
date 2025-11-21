import { fetchVenues } from "../api/venues.mjs";
import { useEffect, useState } from "react";
import VenueCard from "../components/VenueCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import backgroundImage from "../assets/lake.jpg";

export default function AllVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const venuesPerPage = 9;
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    async function getVenues() {
      try {
        const data = await fetchVenues();
        console.log("API Response:", data);
        setVenues(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getVenues();
  }, []);

  const isVenueAvailable = (venue, checkIn, checkOut) => {
    if (!checkIn || !checkOut) return true;
    const from = new Date(venue.availableFrom);
    const to = new Date(venue.availableTo);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return checkInDate >= from && checkOutDate <= to;
  };

  const handleSearchDates = (checkInDate, checkOutDate) => {
    setCheckIn(checkInDate);
    setCheckOut(checkOutDate);
  };

  //Search Venues by name.
  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      isVenueAvailable(venue, checkIn, checkOut)
  );

  // Pagination logic
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = filteredVenues.slice(
    indexOfFirstVenue,
    indexOfLastVenue
  );
  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);

  if (loading) {
    return <div className="text-center py-10">Loading venues...</div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="bg-[var(--bg-body)]">
      {/* Hero section with background image and date picker */}
      <div
        className="w-full h-80 bg-cover bg-center relative mb-16 mt-2"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <SearchBar
          onSearch={handleSearchDates}
          checkIn={checkIn}
          checkOut={checkOut}
        />
      </div>
      {/* Search bar */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 rounded-full border border-[var(--text-sub)] shadow-sm focus:outline-none"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[var(--text-sub)]">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="container mx-auto px-4">
        {currentVenues.length === 0 ? (
          <>
            <div className="text-center py-10 text-gray-500">
              No venues available for your search.
            </div>
            <div className="text-center">
              <a href="/" className="text-[var(--color-primary)] underline">
                Get back to homepage
              </a>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-6 py-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-6 py-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
