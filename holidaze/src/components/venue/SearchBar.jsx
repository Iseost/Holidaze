import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleSearch = () => {
    if (checkIn && checkOut) {
      onSearch(checkIn, checkOut);
    } else {
      alert("Please select both check-in and check-out dates");
    }
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-4">
      <div
        className="
          bg-[var(--bg-header)]
          rounded-2xl shadow-lg
          p-4
          w-full
          flex flex-col sm:flex-row
          gap-3 sm:gap-4
          items-stretch sm:items-center
        "
      >
        {/* Check in */}
        <div className="flex flex-col flex-1">
          <label className="text-xs font-semibold text-[var(--text-body)]">
            Check in
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="
              text-sm text-[var(--text-sub)] 
              outline-none bg-transparent 
              border-b border-[var(--text-sub)] pb-1
              sm:border-none sm:pb-0
            "
          />
        </div>

        {/* Check out */}
        <div className="flex flex-col flex-1">
          <label className="text-xs font-semibold text-[var(--text-body)]">
            Check out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split("T")[0]}
            className="
              text-sm text-[var(--text-sub)] 
              outline-none bg-transparent 
              border-b border-[var(--text-sub)] pb-1
              sm:border-none sm:pb-0
            "
          />
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="
            bg-[var(--color-primary)]
            hover:bg-[var(--color-primary-hover)]
            text-white rounded-full
            p-3
            flex items-center justify-center
            shrink-0
          "
        >
          <svg
            className="w-5 h-5"
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
