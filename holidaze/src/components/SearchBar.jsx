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
      {/* Check in/out dates with search button */}
      <div className="bg-[var(--bg-header)] rounded-full shadow-lg p-3 flex items-center justify-between">
        <div className="flex-1 px-4 border-r border-[var(--text-sub)]">
          <label className="block text-xs font-semibold text-[var(--text-body)]">
            Check in
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full text-sm text-[var(--text-sub)] outline-none bg-transparent"
          />
        </div>
        <div className="flex-1 px-4">
          <label className="block text-xs font-semibold text-[var(--text-body)]">
            Check out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split("T")[0]}
            className="w-full text-sm text-[var(--text-sub)] outline-none bg-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-full p-3 ml-2"
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
