import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVenue } from "../api/venues.mjs";

export default function CreateVenue() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxGuests, setMaxGuests] = useState("2");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postCode, setPostCode] = useState("");
  const [country, setCountry] = useState("");
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);

  const clearForm = () => {
    setImageUrl("");
    setTitle("");
    setDescription("");
    setMaxGuests("2");
    setPrice("");
    setAddress("");
    setCity("");
    setPostCode("");
    setCountry("");
    setWifi(false);
    setParking(false);
    setBreakfast(false);
    setPets(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!title.trim()) {
      setError("Please enter a venue title");
      setLoading(false);
      return;
    }

    const parsedPrice = Number.parseFloat(String(price).replace(",", "."));
    if (!parsedPrice || parsedPrice <= 0) {
      setError("Please enter a valid price");
      setLoading(false);
      return;
    }

    const venueData = {
      name: title.trim(),
      description: description || "",
      media: imageUrl ? [{ url: imageUrl.trim(), alt: title.trim() }] : [],
      price: parsedPrice,
      maxGuests: Number.parseInt(maxGuests, 10) || 0,
      rating: 0,
      meta: {
        wifi: Boolean(wifi),
        parking: Boolean(parking),
        breakfast: Boolean(breakfast),
        pets: Boolean(pets),
      },
      location: {
        address: address || "",
        city: city || "",
        post: postCode || "",
        country: country || "",
      },
    };

    try {
      await createVenue(venueData);
      setSuccess("Venue created successfully!");
      clearForm();
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err?.message || "Failed to create venue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-[var(--bg-body)]">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-sm sm:text-base md:text-5xl font-bold mb-8 mt-20 text-center">
          Your new venue
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* BASIC INFO */}
          <h2 className="text-lg font-semibold">Basic information</h2>
          <hr className="w-40 border-1" />

          <div className="space-y-10">
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
              placeholder="Write a description of the venue here...."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="10"
              className="w-full md:w-[850px] px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
            />
          </div>

          <hr className="mb-16" />

          {/* GUESTS & PRICE */}
          <h2 className="text-lg font-semibold">Guests and Price</h2>
          <hr className="w-40 border-1" />

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

            <div className="pt-4">
              <label className="block text-sm mb-2 text-[var(--text-sub)]">
                Set your price
              </label>
              <input
                type="number"
                min="0"
                placeholder="1299 NOK"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-40 px-4 py-3 border bg-[var(--bg-header)] border-[var(--text-sub)] rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <hr className="mb-16" />

          {/* LOCATION */}
          <h2 className="text-lg font-semibold">Location</h2>
          <hr className="w-40 border-1" />

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
              placeholder="Post Code"
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
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

          <hr className="mb-16" />

          {/* FACILITIES */}
          <h2 className="text-lg font-semibold">Facilities</h2>
          <hr className="w-40 border-1" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={wifi}
                onChange={(e) => setWifi(e.target.checked)}
                className="w-4 h-4 rounded-2xl"
              />
              WiFi
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
                className="w-4 h-4 rounded-2xl"
              />
              Parking
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={breakfast}
                onChange={(e) => setBreakfast(e.target.checked)}
                className="w-4 h-4 rounded-2xl"
              />
              Breakfast
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pets}
                onChange={(e) => setPets(e.target.checked)}
                className="w-4 h-4 rounded-2xl"
              />
              Pets
            </label>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              className="w-full sm:w-[400px] bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg px-4 py-3 font-semibold mt-10"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Venue"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-[400px] text-[var(--text-sub)] rounded-lg px-4 py-3 font-semibold mt-5"
            >
              Cancel
            </button>
          </div>

          {error && (
            <div className="w-full sm:w-[400px] bg-[var(--color-error)] text-white rounded-lg text-sm font-semibold text-center p-1">
              {error}
            </div>
          )}

          {success && (
            <div className="w-full sm:w-[400px] bg-[var(--color-success)] text-white rounded-lg text-sm font-semibold text-center p-1 mt-2">
              {success}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
