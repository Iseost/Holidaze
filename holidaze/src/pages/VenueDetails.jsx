import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

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
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch venue");
        const data = await response.json();
        setVenue(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchVenueDetails();
  }, [id]);

  // Calendar logic
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

  const generateCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-center p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const isToday =
        day === new Date().getDate() &&
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear();

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(day)}
          className={`p-2 text-center rounded-full hover:bg-gray-200 ${
            isToday ? "bg-[var(--color-primary)] text-white" : ""
          } ${selectedDate === day ? "bg-[var(--color-primary)] text-white" : ""}`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!venue) return <div className="text-center py-10">Venue not found</div>;

  return (
    <div className="min-h-screen bg-[var(--bg-header)] 100 py-8">
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
                      className="text-[var(--text-sub)] hover:text-gray-900"
                    >
                      ←
                    </button>
                    <div className="text-center text-[var(--text-body)]">
                      <span className="font-semibold">
                        {monthNames[currentMonth]}
                      </span>
                      <button
                        onClick={() => setCurrentYear(currentYear - 1)}
                        className="ml-2 text-[var(--text-body)]"
                      >
                        {currentYear}
                      </button>
                      <button
                        onClick={() => setCurrentYear(currentYear + 1)}
                        className="ml-1 text-[var(--text-body)]"
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
                      className="text-[var(--text-sub)] hover:text-gray-900"
                    >
                      →
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-xs mb-2">
                    <div className="text-center font-semibold text-[var(--text-body)]">
                      Sun
                    </div>
                    <div className="text-center font-semibold text-[var(--text-body)]">
                      Mon
                    </div>
                    <div className="text-center font-semibold text-[var(--text-body)]">
                      Tue
                    </div>
                    <div className="text-center font-semibold text-[var(--text-body)]">
                      Wed
                    </div>
                    <div className="text-center font-semibold text-[var(--text-body)]">
                      Thu
                    </div>
                    <div className="text-center font-semibold text-[var(--text-body)]">
                      Fri
                    </div>
                    <div className="text-center font-semibold text-[var(--text-body)]">
                      Sat
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-sm text-[var(--text-body)]">
                    {generateCalendar()}
                  </div>
                </div>
              )}

              {/* Book Button */}
              {isLoggedIn ? (
                <Link
                  to={`/booking/${venue.id}`}
                  className="block w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-3 rounded-lg text-center transition-colors"
                >
                  Book now
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="block w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-3 rounded-lg text-center transition-colors"
                >
                  Log in for booking
                </Link>
              )}
            </div>

            {/* Right side - Details */}
            <div className="space-y-6">
              {/* Title */}
              <h1 className="text-2xl font-bold">{venue.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-1 text-2xl text-[var(--text-sub)]">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.floor(venue.rating || 0)
                        ? "text-[var(--text-body)]"
                        : "text-gray-300"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Divider */}
              <hr />

              {/* Address */}
              <div>
                <h2 className="font-semibold mb-2">Adresse</h2>
                <p className="text-[var(--text-body)]">
                  {venue.location?.address || "Address not provided"}
                </p>
                <p className="text-[var(--text-body)]">
                  {venue.location?.city || ""}
                  {venue.location?.city && venue.location?.country ? ", " : ""}
                  {venue.location?.country || ""}
                </p>
                {venue.location?.zip && (
                  <p className="text-[var(--text-body)]">
                    {venue.location.zip}
                  </p>
                )}
              </div>

              {/* Divider */}
              <hr />

              {/* Description */}
              <div>
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-[var(--text-body)] text-sm leading-relaxed">
                  {venue.description || "No description available"}
                </p>
              </div>

              {/* Divider */}
              <hr />

              {/* Facilities */}
              <div>
                <h2 className="font-semibold mb-3">Facilities</h2>
                <div className="space-y-2 text-sm">
                  <div
                    className={
                      venue.meta?.wifi
                        ? "text-[var(--text-body)]"
                        : "text-[var(--text-sub)]"
                    }
                  >
                    {venue.meta?.wifi ? "✓" : "✗"} WiFi
                  </div>
                  <div
                    className={
                      venue.meta?.parking
                        ? "text-[var(--text-body)]"
                        : "text-[var(--text-sub)]"
                    }
                  >
                    {venue.meta?.parking ? "✓" : "✗"} Parking
                  </div>
                  <div
                    className={
                      venue.meta?.breakfast
                        ? "text-[var(--text-body)]"
                        : "text-[var(--text-sub)]"
                    }
                  >
                    {venue.meta?.breakfast ? "✓" : "✗"} Breakfast
                  </div>
                  <div
                    className={
                      venue.meta?.pets
                        ? "text-[var(--text-body)]"
                        : "text-[var(--text-sub)]"
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
