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
      // navigate to home or another page after success
      navigate("/");
    } catch (err) {
      setError(err?.message || "Failed to create venue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <div>
          <h1>Your new venue</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <h2>Basic information</h2>
            <div>
              <input
                type="url"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className=""
              />

              <input
                type="text"
                placeholder="Enter your venue title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className=""
              />

              <textarea
                placeholder="Write a description of the venue here...."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className=""
              />
            </div>

            <hr />
            {/* Guest and price */}
            <div>
              <h2>Guests and Price</h2>
              <hr />
              <div className="space-y-4">
                <div>
                  <label>Max Guests:</label>
                  <input
                    type="number"
                    min="1"
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                    required
                    className=""
                  />
                </div>
                <div>
                  <label>Set your price</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1299 NOK"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className=""
                  />
                </div>
              </div>
            </div>

            <hr />
            {/* Location */}
            <div>
              <h2>Location</h2>
              <hr />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className=""
                />
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className=""
                />
                <input
                  type="text"
                  placeholder="Post Code"
                  value={postCode}
                  onChange={(e) => setPostCode(e.target.value)}
                  className=""
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className=""
                />
              </div>
            </div>

            <hr />
            {/* Facilities */}
            <div>
              <h2>Facilities</h2>
              <hr />
              <div className="grid grid-cols-4 gap-4">
                <label>
                  <input
                    type="checkbox"
                    checked={wifi}
                    onChange={(e) => setWifi(e.target.checked)}
                  />{" "}
                  WiFi
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={parking}
                    onChange={(e) => setParking(e.target.checked)}
                  />{" "}
                  Parking
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={breakfast}
                    onChange={(e) => setBreakfast(e.target.checked)}
                  />{" "}
                  Breakfast
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={pets}
                    onChange={(e) => setPets(e.target.checked)}
                  />{" "}
                  Pets
                </label>
              </div>
            </div>

            {error && <div>{error}</div>}
            {success && <div>{success}</div>}

            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Venue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
