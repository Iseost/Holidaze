import { useEffect, useState, useCallback } from "react";
import { fetchVenues } from "../api/venues.mjs";
import VenueCard from "../components/VenueCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import backgroundImage from "../assets/lake.jpg";

export default function AllVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const venuesPerPage = 9;
  const accessToken = localStorage.getItem("accessToken");

  const getVenues = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchVenues(accessToken, page, venuesPerPage);
        setVenues(data.data || []);
        setTotalPages(data.meta?.pageCount || 1);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch venues");
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    getVenues(currentPage);
  }, [currentPage, getVenues]);

  const isVenueAvailable = (venue, checkIn, checkOut) => {
    if (!checkIn || !checkOut) return true;
    const from = new Date(venue.availableFrom || venue.created);
    const to = new Date(venue.availableTo || venue.created);
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    return checkInDate >= from && checkOutDate <= to;
  };

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      isVenueAvailable(venue, checkIn, checkOut)
  );

  const handleSearchDates = (checkInDate, checkOutDate) => {
    setCheckIn(checkInDate);
    setCheckOut(checkOutDate);
  };

  if (loading)
    return <div className="text-center py-10">Loading venues...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        {error} <br />
        Please try again in a minute.
      </div>
    );

  return (
    <div className="bg-[var(--bg-body)]">
      {/* Hero section */}
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

      {/* Search input */}
      <div className="container mx-auto px-4 mb-8">
        <div className="max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 rounded-full border border-[var(--text-sub)] shadow-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Venues Grid */}
      <div className="container mx-auto px-4">
        {filteredVenues.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No venues available for your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
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
