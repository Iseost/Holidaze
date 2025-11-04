//make a venue card component that takes in props for name, location, price, rating, and image url

import React from "react";

export default function VenueCard({ venue }) {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden">
      <img
        src={
          venue.media?.[0]?.url ||
          "https://via.placeholder.com/400x200?text=No+Image"
        }
        alt={venue.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{venue.name}</h2>
        <p className="text-gray-600 mb-1">
          Location: {venue.location.city}, {venue.location.country}
        </p>
        <p className="text-gray-600 mb-1">Price: ${venue.price} per night</p>
        <p className="text-yellow-500">
          Rating: {venue.rating ? venue.rating.toFixed(1) : "N/A"}
        </p>
      </div>
    </div>
  );
}
