import { Link } from "react-router-dom";

export default function VenueCard({ venue, showEdit = false, onEdit }) {
  const smallerSentence = (text) => {
    if (!text) return "No description available";
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const twoSentences = sentences.slice(0, 2).join(" ");

    if (twoSentences.length > 120) {
      return twoSentences.slice(0, 120) + "...";
    }

    return twoSentences;
  };

  return (
    <Link to={`/venue/${venue.id}`}>
      <div className="flex flex-col rounded-xl bg-(--bg-header) shadow-md transition-all duration-300 transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer overflow-hidden w-full min-h-[420px] sm:min-h-[450px] md:min-h-[480px]">
        <div className="flex items-center justify-center w-full h-40 sm:h-48 md:h-56 overflow-hidden shrink-0">
          <img
            src={
              venue.media?.[0]?.url ||
              "https://via.placeholder.com/400x200?text=No+Image"
            }
            alt={venue.media?.[0]?.alt || venue.name}
            className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-sm md:text-2xl font-bold mb-2">{venue.name}</h2>

          <div className="flex items-center gap-1 text-xl sm:text-2xl text-(--text-sub) border-b border-(--text-sub) pb-3">
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

          <p className="text-xs sm:text-sm pb-3 border-b border-(--text-sub) pt-3 line-clamp-3">
            {smallerSentence(venue.description)}
          </p>

          <p className="text-base sm:text-lg font-semibold mt-4 text-(--text-body)">
            From {venue.price} NOK / night
          </p>

          {showEdit && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onEdit?.(venue);
              }}
              className="mt-4 px-4 py-2 font-semibold bg-[var(--bg-header)] text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary-hover)] w-26"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
