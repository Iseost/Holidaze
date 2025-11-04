export default function VenueCard({ venue }) {
  const smallerSentence = (text) => {
    if (!text) return "No description available";
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return sentences.slice(0, 2).join(" ");
  };

  return (
    <div className="flex flex-col rounded-xl bg-white shadow-md transition-all duration-300 transform hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer max-w-sm overflow-hidden">
      {/* Image Container */}
      <div className="flex items-center justify-center w-full h-[240px] overflow-hidden">
        <img
          src={
            venue.media?.[0]?.url ||
            "https://via.placeholder.com/400x200?text=No+Image"
          }
          alt={venue.media?.[0]?.alt || venue.name}
          className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">{venue.name}</h2>

        {/* Description with border */}
        <p className="text-gray-600 text-sm pb-3 border-b border-gray-300">
          {smallerSentence(venue.description)}
        </p>

        {/* Price with border */}
        <p className="text-lg font-semibold text-gray-900 mt-3 pb-3 border-b border-gray-300">
          {venue.price} NOK / night
        </p>

        {/* Rating */}
        <p className="text-sm text-yellow-500 mt-3">
          Rating: {venue.rating ? venue.rating.toFixed(1) : "N/A"}
        </p>
      </div>
    </div>
  );
}
