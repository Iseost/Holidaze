import { useState, useEffect } from "react";
import VenueCard from "../components/VenueCard";
import EditProfileModal from "../components/EditProfileModal";
import { getManagerProfile, updateProfile } from "../api/profiles.mjs";

export default function ProfileVenueManager() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const username = localStorage.getItem("username");

  useEffect(() => {
    if (!username) return;
    fetchProfile();
  }, [username]);

  async function fetchProfile() {
    try {
      const data = await getManagerProfile(username);
      setProfile(data);
    } catch (err) {
      alert("Failed to load profile: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveProfile = async (updateData) => {
    try {
      await updateProfile(username, updateData);
      await fetchProfile();
      setIsEditModalOpen(false);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    }
  };

  const handleEditVenue = (venue) => {
    window.location.href = `/edit-venue/${venue.id}`;
  };

  if (loading || !profile) return <p>Loading...</p>;

  return (
    <div className="mx-auto relative">
      {/* Banner */}
      {profile.banner?.url && (
        <div className="h-80 mb-4 overflow-hidden rounded-br-full">
          <img
            src={profile.banner.url}
            alt={profile.banner.alt || "User banner"}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Edit profile */}
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="absolute top-4 left-4 text-[var(--text-sub)] font-semibold cursor-pointer"
      >
        Edit Profile
      </button>

      {/* Avatar + Name */}
      <div className="flex items-center pl-16 -mt-12">
        {profile.avatar?.url && (
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || "User avatar"}
            className="w-24 h-24 rounded-full object-cover mr-4"
          />
        )}
        <h1 className="text-3xl font-bold pt-14">
          {profile.name || "No name set"}
        </h1>
      </div>

      {/* MY VENUES */}
      <section className="mt-20 pl-16 pr-16">
        <h2 className="text-2xl font-semibold mb-2">My Venues</h2>
        <hr className="mt-4 mb-4 w-[590px]" />

        {profile.venues?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile.venues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                showEdit={true}
                onEdit={() => handleEditVenue(venue)}
                clickable={true}
              />
            ))}
          </div>
        ) : (
          <p>You don’t have any venues at the moment.</p>
        )}
      </section>

      {/* BOOKED VENUES */}
      <section className="mt-20 pl-16 pr-16">
        <h2 className="text-2xl font-semibold mb-2">Booked Venues</h2>
        <hr className="mt-4 mb-4 w-[590px]" />

        {profile.bookedVenues?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {profile.bookedVenues.map((booking) => (
              <VenueCard
                key={booking.id}
                venue={booking.venue}
                booking={booking}
                clickable={true}
              />
            ))}
          </div>
        ) : (
          <p>You don’t have any bookings at the moment.</p>
        )}
      </section>

      {/* Edit modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
