// venue card
// if venue manager - need a edit button on venue card

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function VenueCard({ venue }) {
  const [user, setUser] = useState(null);

  const smallerSentence = (text) => {
    if (!text) return "No description available";
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return sentences.slice(0, 2).join(" ");
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    setUser(storedUser);
  }, []);

  const isVenueManager = user?.venueManager === true;

  const handleEditClick = (e) => {
    if (!isVenueManager) {
      e.preventDefault();
      return;
    }

    window.location.href = `/edit-venue/${venue.id}`;
  };

  return (
    <Link to={`/venue/${venue.id}`}>
      <div className="flex flex-col rounded-xl bg-[var(--bg-header)] shadow-md transition-all duration-300 transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer max-w-sm overflow-hidden">
        {/* Image Container */}
        <div className="flex items-center justify-center w-full h-60 overflow-hidden flex-shrink-0">
          <img
            src={
              venue.media?.[0]?.url ||
              "https://via.placeholder.com/400x200?text=No+Image"
            }
            alt={venue.media?.[0]?.alt || venue.name}
            className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x200?text=No+Image";
            }}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h2 className="text-xl font-bold mb-2">{venue.name}</h2>
          {/* Rating */}
          <div className="flex items-center gap-1 text-2xl text-[var(--text-sub)]  border-b border-[var(--text-sub)] pb-6">
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

          {/* Description with border */}
          <p className="text-sm pb-6 border-b border-[var(--text-sub)] pt-6">
            {smallerSentence(venue.description)}
          </p>

          {/* Price */}
          <p className="text-lg font-semibold  mt-8 text-[var(--text-body)]">
            From {venue.price} NOK / night
          </p>
          {isVenueManager && (
            <button
              onClick={handleEditClick}
              className="mt-4 px-4 py-2 font-semibold bg-[var(--bg-header)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-hover)]"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
