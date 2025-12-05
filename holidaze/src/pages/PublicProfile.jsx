import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VenueCard from "../components/venue/VenueCard";
import { getBasicProfile, getManagerProfile } from "../api/profiles.mjs";

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUsername = localStorage.getItem("username");
  const isOwnProfile = username === currentUsername;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!username) {
      setError("No username provided");
      setLoading(false);
      return;
    }

    if (isOwnProfile) {
      navigate("/profile");
      return;
    }

    async function fetchPublicProfile() {
      try {
        setLoading(true);
        setError(null);

        const basicProfile = await getBasicProfile(username);

        if (!basicProfile.venueManager) {
          setError(
            "This profile is private. Only venue managers can be viewed publicly."
          );
          setLoading(false);
          return;
        }
        const data = await getManagerProfile(username);
        setProfile(data);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile. User may not exist.");
      } finally {
        setLoading(false);
      }
    }

    fetchPublicProfile();
  }, [username, isOwnProfile, navigate]);

  if (loading) {
    return <p className="text-center py-10 mt-20">Loading profile...</p>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-(--color-error) p-4 rounded-lg text-center">
          {error}
        </div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/")}
            className="text-primary hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10 mt-20">
        <p>Profile not found</p>
        <button
          onClick={() => navigate("/")}
          className="text-primary hover:underline mt-4"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const isVenueManager = profile.venueManager || false;

  return (
    <div className="mx-auto relative">
      {/* Banner */}
      {profile.banner?.url && (
        <div className="h-40 sm:h-56 md:h-80 mb-4 overflow-hidden md:rounded-br-full">
          <img
            src={profile.banner.url}
            alt={profile.banner.alt || `${profile.name}'s banner`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Profile Info */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 px-4 md:px-16 -mt-16 md:-mt-20">
        {profile.avatar?.url && (
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || `${profile.name}'s avatar`}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mr-4 border-4 border-white shadow-lg"
          />
        )}
        <div className="text-center md:text-left">
          <h1 className="text-sm sm:text-base md:text-5xl font-bold pt-1.5 md:pt-20">
            {profile.name || "Unknown User"}
          </h1>
          <p className="text-(--text-sub)">{profile.email}</p>
          {isVenueManager && (
            <span className="inline-block mt-2 bg-blue-100 text-(--text-sub) text-xs px-2 py-1 rounded">
              Venue Manager
            </span>
          )}
        </div>
      </div>

      {/* Content wrapper */}
      <div className="container mx-auto px-4 md:px-16">
        <section className="mt-16 md:mt-30">
          <h2 className="text-sm md:text-2xl font-semibold mb-2">
            {profile.name}'s Venues
          </h2>
          <hr className="my-4 mb-10" />

          {profile.venues?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {profile.venues.map((venue) => (
                <VenueCard
                  key={venue.id}
                  venue={venue}
                  showEdit={false}
                  clickable={true}
                />
              ))}
            </div>
          ) : (
            <p className="text-(--text-sub) -mt-5">
              This venue manager doesn't have any venues yet.
            </p>
          )}
        </section>
      </div>

      {/* Back button */}
      <div className="container mx-auto px-4 md:px-16 mt-8 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:underline flex items-center gap-2"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
