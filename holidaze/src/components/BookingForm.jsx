import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchVenueById } from "../api/venues.mjs"; // Fixed typo: was "fetcvehVenueById"
import { createBooking } from "../api/bookings.mjs";

export default function BookingForm() {
  const { id: venueId } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const userEmail = localStorage.getItem("username") || ""; // Changed from "userEmail" to "username"

  useEffect(() => {
    async function loadVenue() {
      try {
        console.log("Fetching venue with ID:", venueId); // Debug log
        const data = await fetchVenueById(venueId);
        console.log("Venue loaded:", data); // Debug log
        setVenue(data); // Just use data directly now
      } catch (err) {
        console.error("Error loading venue:", err); // Debug log
        setError(`Failed to load venue details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    loadVenue();
  }, [venueId]);

  // Calculate total price whenever check-in, check-out, guests change
  const calculateBooking = () => {
    if (!checkIn || !checkOut || !venue) return { nights: 0, total: 0 };

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const timeDiff = checkOutDate - checkInDate;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (nights <= 0) return { nights: 0, total: 0 };

    const total = nights * venue.price; // Removed * guests - price is per night, not per guest
    return { nights, total };
  };

  const { nights, total } = calculateBooking();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Validation
    if (!checkIn || !checkOut || nights <= 0) {
      setError("Please select valid check-in and check-out dates.");
      setSubmitting(false);
      return;
    }

    if (guests < 1 || guests > venue.maxGuests) {
      setError(`Number of guests must be between 1 and ${venue.maxGuests}.`);
      setSubmitting(false);
      return;
    }

    const bookingData = {
      dateFrom: checkIn, // API expects "dateFrom" not "checkIn"
      dateTo: checkOut, // API expects "dateTo" not "checkOut"
      guests: parseInt(guests),
      venueId: venueId,
    };

    try {
      await createBooking(bookingData);
      alert("Booking successful!");
      navigate("/profile"); // Navigate to profile to see bookings
    } catch (err) {
      setError(err.message || "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error && !venue)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!venue) return <div className="text-center py-10">Venue not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Make your booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Venue Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-fit">
            <img
              src={
                venue.media?.[0]?.url || "https://via.placeholder.com/400x300"
              }
              alt={venue.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{venue.name}</h2>

              {/* Rating */}
              <div className="flex items-center gap-1 text-yellow-500 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>
                    {i < Math.floor(venue.rating || 0) ? "★" : "☆"}
                  </span>
                ))}
              </div>

              {/* Facilities */}
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Address:</strong> {venue.location?.address || "N/A"}
                </p>
                <p>
                  <strong>City:</strong> {venue.location?.city || "N/A"}
                </p>
                <p>
                  <strong>Max Guests:</strong> {venue.maxGuests}
                </p>
                <p>
                  <strong>Price:</strong> {venue.price} NOK / night
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Booking Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Check-in and Check-out dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              {/* Number of Guests */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  min="1"
                  max={venue.maxGuests}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={`Max ${venue.maxGuests} guests`}
                />
              </div>

              {/* Booking As */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Booking as (email/username)
                </label>
                <input
                  type="text"
                  value={userEmail}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <hr className="border-gray-300" />

              {/* Booking Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Booking Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-semibold">
                      {checkIn || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-semibold">
                      {checkOut || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guests:</span>
                    <span className="font-semibold">{guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of nights:</span>
                    <span className="font-semibold">{nights || 0}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="text-gray-600">Price per night:</span>
                    <span className="font-semibold">{venue.price} NOK</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-300">
                    <span>Total Price:</span>
                    <span className="text-blue-600">{total} NOK</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || nights <= 0}
                className="w-full bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {submitting ? "Booking..." : "Book now"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
