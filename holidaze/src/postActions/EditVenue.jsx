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
  const [confirmError, setConfirmError] = useState(null);

  // Form state
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

      // Success message
      setSuccess("Venue updated successfully!");
      setTimeout(() => setSuccess(null), 3000); // fjern etter 3 sek

      setSaving(false);

      // Naviger etter kort delay, hvis ønskelig
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setError(err.message || "Failed to update venue");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setConfirmError(null);
    if (
      !window.confirm(
        "Are you sure you want to delete this venue? This cannot be undone."
      )
    )
      return;

    try {
      await deleteVenue(id);

      // Success message
      setSuccess("Venue deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);

      // Naviger etter kort delay
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      setConfirmError(err.message || "Failed to delete venue");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen py-8 bg-[var(--bg-body)]">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-8 text-center">Edit your venue</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic info */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Basic information</h2>
            <hr className="w-40 border-1 mb-4" />
            <div className="space-y-4">
              <input
                type="url"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
              />
              <input
                type="text"
                placeholder="Enter your venue title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
              />
              <textarea
                placeholder="Write a description of the venue here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Guests & Price */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Guests and Price</h2>
            <hr className="w-40 border-1 mb-4" />
            <div className="space-y-4">
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

          {/* Location */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Location</h2>
            <hr className="w-40 border-1 mb-4" />
            <div className="grid grid-cols-2 gap-10 mt-4 mb-8">
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

          {/* Facilities */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Facilities</h2>
            <hr className="w-40 border-1 mb-4" />
            <div className="grid grid-cols-4 gap-4 mt-4">
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

          {/* Action buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-300"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-[var(--color-error)] hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Delete this venue
            </button>
          </div>
          {error && (
            <div className="w-full bg-[var(--color-error)] text-[var(--bg-header)] rounded-lg text-sm font-semibold text-center p-2">
              {error}
            </div>
          )}

          {/* Confirm error (for delete) */}
          {confirmError && (
            <div className="bg-[var(--color-error)] text-[var(--bg-header)] rounded-lg text-sm font-semibold text-center p-1 mt-2">
              {confirmError}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="bg-[var(--color-success)] text-[var(--bg-header)] text-sm rounded-lg font-semibold p-1 mt-2 mb-2 text-center transition-opacity duration-500 opacity-100">
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
