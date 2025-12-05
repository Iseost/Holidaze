import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchVenueById, updateVenue, deleteVenue } from "../api/venues.mjs";

export default function EditVenue() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxGuests, setMaxGuests] = useState(2);
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);

  useEffect(() => {
    async function loadVenue() {
      try {
        const venue = await fetchVenueById(id);

        setImageUrl(venue.media?.[0]?.url || "");
        setTitle(venue.name || "");
        setDescription(venue.description || "");
        setMaxGuests(venue.maxGuests || 2);
        setPrice(venue.price || "");
        setAddress(venue.location?.address || "");
        setCity(venue.location?.city || "");
        setZipCode(venue.location?.zip || "");
        setCountry(venue.location?.country || "");
        setWifi(venue.meta?.wifi || false);
        setParking(venue.meta?.parking || false);
        setBreakfast(venue.meta?.breakfast || false);
        setPets(venue.meta?.pets || false);
      } catch (err) {
        setError(err.message || "Failed to load venue");
      } finally {
        setLoading(false);
      }
    }
    loadVenue();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const venueData = {
        name: title,
        description,
        media: imageUrl ? [{ url: imageUrl, alt: title }] : [],
        price: parseFloat(price),
        maxGuests: parseInt(maxGuests),
        meta: { wifi, parking, breakfast, pets },
        location: { address, city, zip: zipCode, country },
      };

      await updateVenue(id, venueData);

      setSuccess("Venue updated successfully!");
      setTimeout(() => setSuccess(null), 3000);

      setSaving(false);

      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.message || "Failed to update venue");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteVenue(id);
      setSuccess("Venue deleted successfully!");
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.message || "Failed to delete venue");
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen py-8 bg-[var(--bg-body)]">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-sm sm:text-base md:text-5xl font-bold mb-8 mt-20 text-center">
          Edit your venue
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-sm md:text-2xl font-semibold mb-2">
              Basic information
            </h2>
            <hr className="w-40 border-1 mb-4" />
            <div className="space-y-4">
              <input
                type="url"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full md:w-[850px] px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Enter your venue title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full md:w-[850px] px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
              />
              <textarea
                placeholder="Write a description of the venue here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full md:w-[850px] px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm md:text-2xl font-semibold mb-2">
              Guests and Price
            </h2>
            <hr className="w-40 border-1 mb-4" />
            <div className="space-y-4 mt-10">
              <div>
                <label className="block text-sm mb-2 text-[var(--text-sub)]">
                  How many guests can your venue accommodate?
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(e.target.value)}
                  required
                  className="w-20 px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-[var(--text-sub)]">
                  Set your price
                </label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-40 px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm md:text-2xl font-semibold mb-2">Location</h2>
            <hr className="w-40 border-1 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14 mb-14">
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm md:text-2xl font-semibold mb-2">
              Facilities
            </h2>
            <hr className="w-40 border-1 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {[
                { label: "WiFi", value: wifi, set: setWifi },
                { label: "Parking", value: parking, set: setParking },
                { label: "Breakfast", value: breakfast, set: setBreakfast },
                { label: "Pets", value: pets, set: setPets },
              ].map((facility) => (
                <label
                  key={facility.label}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={facility.value}
                    onChange={(e) => facility.set(e.target.checked)}
                    className="w-4 h-4 rounded-2xl"
                  />
                  <span className="text-[var(--text-body)]">
                    {facility.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-[400px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg px-4 py-3 font-semibold mt-10"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full sm:w-[400px] bg-[var(--color-error)] hover:bg-red-600 text-white font-semibold rounded-lg px-4 py-3 mt-10 transition-colors"
            >
              Delete this venue
            </button>
          </div>
          {error && (
            <div className="w-full sm:w-[400px] bg-[var(--color-error)] text-[var(--bg-header)] rounded-lg text-sm font-semibold text-center p-2">
              {error}
            </div>
          )}

          {success && (
            <div className="w-full sm:w-[400px] bg-[var(--color-success)] text-[var(--bg-header)] text-sm rounded-lg font-semibold p-1 mt-2 mb-2 text-center transition-opacity duration-500 opacity-100">
              {success}
            </div>
          )}
        </form>
      </div>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-lg z-50">
          <div className="bg-[var(--bg-header)] p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h2 className="text-sm md:text-2xl font-semibold mb-4 text-[var(--text-body)]">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-[var(--text-sub)]">
              Are you sure you want to delete this venue? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-[var(--color-error)] text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Back Button */}
      <div className="container mx-auto px-4 md:px-16 mt-8 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:underline font-semibold flex items-center gap-2"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
