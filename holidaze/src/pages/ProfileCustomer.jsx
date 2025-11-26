import { useState, useEffect } from "react";
import EditProfileModal from "../components/EditProfileModal.jsx";
import { updateProfile, getUserProfileWithBookings } from "../api/profiles.mjs";
import VenueCard from "../components/VenueCard";

export default function ProfileCustomer() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const username = localStorage.getItem("username");

  const [profile, setProfile] = useState(storedUser || null);
  const [loading, setLoading] = useState(!storedUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!username || storedUser) return;
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfileWithBookings(username);
      setProfile(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      alert("Failed to load profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) return <p>Loading...</p>;

  const now = new Date();
  const upcomingBookings = profile.bookings?.filter(
    (booking) => new Date(booking.dateTo) >= now
  );
  const pastBookings = profile.bookings?.filter(
    (booking) => new Date(booking.dateTo) < now
  );

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

      {/* Edit button */}
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="absolute top-4 left-4 text-(--text-sub) font-semibold cursor-pointer"
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

      {/* UPCOMING BOOKINGS */}
      <div className="mb-8 mt-30 ml-25">
        <h2 className="text-2xl font-semibold mb-2">Your next adventure</h2>
        <hr className="mt-4 mb-4 max-w-3xl" />

        {upcomingBookings?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingBookings.map((booking) => (
              <VenueCard
                key={booking.id}
                venue={booking.venue}
                booking={booking}
                clickable={true}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            You don't have any upcoming bookings at the moment.
          </p>
        )}
      </div>

      {/* PAST BOOKINGS */}
      {pastBookings?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Past Bookings</h2>
          <hr className="mt-4 mb-4 max-w-3xl" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastBookings.map((booking) => (
              <VenueCard
                key={booking.id}
                venue={booking.venue}
                booking={booking}
                clickable={true}
                isPast={true}
              />
            ))}
          </div>
        </div>
      )}

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
