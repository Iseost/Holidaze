import { fetchVenues } from "../api/venues.mjs";
import { useEffect, useState } from "react";
import VenueCard from "../components/VenueCard.jsx";

export default function AllVenues() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getVenues() {
      try {
        const data = await fetchVenues();
        console.log("API Response:", data);
        setVenues(data.data || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getVenues();
  }, []);

  if (loading) {
    return <div>Loading venues...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6"></h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
}
