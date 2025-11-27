// venue card
// if venue manager - need a edit button on venue card

import { Link } from "react-router-dom";

export default function VenueCard({ venue, showEdit = false, onEdit }) {
  const smallerSentence = (text) => {
    if (!text) return "No description available";
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return sentences.slice(0, 2).join(" ");
  };

  return (
    <Link to={`/venue/${venue.id}`}>
      <div className="flex flex-col rounded-xl bg-(--bg-header) shadow-md transition-all duration-300 transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer max-w-sm overflow-hidden">
        {/* IMAGE */}
        <div className="flex items-center justify-center w-full h-60 overflow-hidden">
          <img
            src={
              venue.media?.[0]?.url ||
              "https://via.placeholder.com/400x200?text=No+Image"
            }
            alt={venue.media?.[0]?.alt || venue.name}
            className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* CONTENT */}
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{venue.name}</h2>

          {/* Stars */}
          <div className="flex items-center gap-1 text-2xl text-(--text-sub) border-b border-(--text-sub) pb-6">
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

          {/* Desc */}
          <p className="text-sm pb-6 border-b border-(--text-sub) pt-6">
            {smallerSentence(venue.description)}
          </p>

          {/* Price */}
          <p className="text-lg font-semibold mt-8 text-(--text-body)">
            From {venue.price} NOK / night
          </p>

          {/* SHOW EDIT ONLY IF PARENT SAYS SO */}
          {showEdit && (
            <button
              onClick={(e) => {
                e.preventDefault(); // prevent Link navigation
                onEdit?.(venue);
              }}
              className="mt-4 px-4 py-2 font-semibold bg-(--bg-header) text-primary rounded-lg hover:bg-primary-hover"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
