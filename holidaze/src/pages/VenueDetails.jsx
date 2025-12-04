import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchVenueById } from "../api/venues.mjs";

export default function VenueDetail() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const isLoggedIn = !!localStorage.getItem("accessToken");

  useEffect(() => {
    async function fetchVenueDetails() {
      try {
        const data = await fetchVenueById(id, { includeBookings: true });
        setVenue(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVenueDetails();
  }, [id]);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const isDateBooked = (day, month, year) => {
    if (!venue?.bookings || venue.bookings.length === 0) return false;
    const current = new Date(year, month, day).setHours(0, 0, 0, 0);
    for (const booking of venue.bookings) {
      const from = new Date(booking.dateFrom).setHours(0, 0, 0, 0);
      const to = new Date(booking.dateTo).setHours(0, 0, 0, 0);
      if (current >= from && current < to) {
        return true;
      }
    }
    return false;
  };

  const generateCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-center p-2"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const isToday =
        day === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear();

      const booked = isDateBooked(day, currentMonth, currentYear);

      days.push(
        <button
          key={day}
          onClick={() => !booked && setSelectedDate(day)}
          disabled={booked}
          className={`p-2 text-center rounded-full transition-colors ${
            booked
              ? "bg-red-200 text-red-700 cursor-not-allowed"
              : "hover:bg-gray-200"
          } ${isToday ? "ring-2 ring-primary" : ""} ${
            selectedDate === day && !booked ? "bg-primary text-white" : ""
          }`}
          title={booked ? "Booked" : "Available"}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  if (loading)
    return (
      <div className="text-center py-10 text-(--text-sub)">Loading...</div>
    );
  if (error)
    return <div className="text-center py-10 text-error">Error: {error}</div>;
  if (!venue)
    return (
      <div className="text-center py-10 text-(--text-sub)">Venue not found</div>
    );

  return (
    <div className="min-h-screen bg-(--bg-header) py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side - Image and User/Calendar */}
            <div className="space-y-6">
              <img
                src={
                  venue.media?.[0]?.url ||
                  "https://via.placeholder.com/400x300?text=No+Image"
                }
                alt={venue.media?.[0]?.alt || venue.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <hr />
              <div>
                {/* Venue Owner Info */}
                <h2 className="font-semibold mb-3">Hosted by</h2>
                {venue.owner ? (
                  <Link
                    to={`/profile/${venue.owner.name}`}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    {venue.owner.avatar?.url ? (
                      <img
                        src={venue.owner.avatar.url}
                        alt={venue.owner.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-600">
                          {venue.owner.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-primary hover:underline">
                        {venue.owner.name}
                      </p>
                      <p className="text-xs text-gray-500">View profile →</p>
                    </div>
                  </Link>
                ) : (
                  <p className="text-sm text-(--text-sub)">
                    Owner information not available
                  </p>
                )}
              </div>
              <hr />

              {/* Calendar for logged in users */}
              {isLoggedIn && (
                <div className="rounded-lg shadow-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={() => {
                        if (currentMonth === 0) {
                          setCurrentMonth(11);
                          setCurrentYear(currentYear - 1);
                        } else {
                          setCurrentMonth(currentMonth - 1);
                        }
                      }}
                      className="text-(--text-sub) hover:text-gray-900"
                    >
                      ←
                    </button>
                    <div className="text-center text-(--text-body)">
                      <span className="font-semibold">
                        {monthNames[currentMonth]}
                      </span>
                      <button
                        onClick={() => setCurrentYear(currentYear - 1)}
                        className="ml-2 text-(--text-body)"
                      >
                        {currentYear}
                      </button>
                      <button
                        onClick={() => setCurrentYear(currentYear + 1)}
                        className="ml-1 text-(--text-body)"
                      >
                        ▼
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        if (currentMonth === 11) {
                          setCurrentMonth(0);
                          setCurrentYear(currentYear + 1);
                        } else {
                          setCurrentMonth(currentMonth + 1);
                        }
                      }}
                      className="text-(--text-sub) hover:text-gray-900"
                    >
                      →
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-xs mb-2">
                    <div className="text-center font-semibold text-(--text-body)">
                      Sun
                    </div>
                    <div className="text-center font-semibold text-(--text-body)">
                      Mon
                    </div>
                    <div className="text-center font-semibold text-(--text-body)">
                      Tue
                    </div>
                    <div className="text-center font-semibold text-(--text-body)">
                      Wed
                    </div>
                    <div className="text-center font-semibold text-(--text-body)">
                      Thu
                    </div>
                    <div className="text-center font-semibold text-(--text-body)">
                      Fri
                    </div>
                    <div className="text-center font-semibold text-(--text-body)">
                      Sat
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-sm text-(--text-body)">
                    {generateCalendar()}
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-(--text-body)">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded bg-red-200 border border-red-400"></span>
                      <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded bg-gray-200"></span>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded ring-2 ring-primary"></span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Book Button */}
              {isLoggedIn ? (
                <Link
                  to={`/booking/${venue.id}`}
                  className="block w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg text-center transition-colors"
                >
                  Book now
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg text-center transition-colors"
                >
                  Log in for booking
                </Link>
              )}
            </div>

            {/* Right side - Details */}
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">{venue.name}</h1>
              <div className="flex items-center gap-1 text-2xl text-(--text-sub)">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.floor(venue.rating || 0)
                        ? "text-(--text-body)"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <hr />
              <div>
                <h2 className="font-semibold mb-2">Adresse</h2>
                <p className="text-(--text-body)">
                  {venue.location?.address || "Address not provided"}
                </p>
                <p className="text-(--text-body)">
                  {venue.location?.city || ""}
                  {venue.location?.city && venue.location?.country ? ", " : ""}
                  {venue.location?.country || ""}
                </p>
                {venue.location?.zip && (
                  <p className="text-(--text-body)">{venue.location.zip}</p>
                )}
              </div>
              <hr />
              <div>
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-(--text-body) text-sm leading-relaxed">
                  {venue.description || "No description available"}
                </p>
              </div>
              <hr />
              <div>
                <h2 className="font-semibold mb-3">Facilities</h2>
                <div className="space-y-2 text-sm">
                  <div
                    className={
                      venue.meta?.wifi
                        ? "text-(--text-body)"
                        : "text-(--text-sub)"
                    }
                  >
                    {venue.meta?.wifi ? "✓" : "✗"} WiFi
                  </div>
                  <div
                    className={
                      venue.meta?.parking
                        ? "text-(--text-body)"
                        : "text-(--text-sub)"
                    }
                  >
                    {venue.meta?.parking ? "✓" : "✗"} Parking
                  </div>
                  <div
                    className={
                      venue.meta?.breakfast
                        ? "text-(--text-body)"
                        : "text-(--text-sub)"
                    }
                  >
                    {venue.meta?.breakfast ? "✓" : "✗"} Breakfast
                  </div>
                  <div
                    className={
                      venue.meta?.pets
                        ? "text-(--text-body)"
                        : "text-(--text-sub)"
                    }
                  >
                    {venue.meta?.pets ? "✓" : "✗"} Pets Allowed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
