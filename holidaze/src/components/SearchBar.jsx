import { useState } from "react";

export default function SearchBar() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl px-4">
      {/* Check-in/out dates with search button */}
      <div className="bg-white rounded-full shadow-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex-1 px-4 border-r border-gray-300">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Check in
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full text-gray-700 outline-none"
            placeholder="Add date"
          />
        </div>
        <div className="flex-1 px-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Check out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full text-gray-700 outline-none"
            placeholder="Add date"
          />
        </div>
        <button
          type="button"
          className="bg-primary hover:bg-primary-hover text-white rounded-full ml-2 p-4"
        >
          <svg
            className="w-6 h-6"
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
  );
}
