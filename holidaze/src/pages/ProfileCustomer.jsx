import { useState, useEffect } from "react";
import EditProfileModal from "../components/EditProfileModal.jsx";
import { updateProfile, getUserProfileWithBookings } from "../api/profiles.mjs";

export default function ProfileCustomer() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const username = localStorage.getItem("username");

  // Hent profil + booking info
  useEffect(() => {
    if (!username) return;
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const data = await getUserProfileWithBookings(username);
      setProfile(data);
    } catch (err) {
      console.error(err);
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

  return (
    <div className="mx-auto">
      {/* Banner */}
      {profile.banner?.url && (
        <div className=" h-80 mb-4 overflow-hidden rounded-br-full">
          <img
            src={profile.banner.url}
            alt={profile.banner.alt || "User banner"}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Avatar og navn */}
      <div className="flex items-center pl-16">
        {profile.avatar?.url && (
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || "User avatar"}
            className="w-24 h-24 rounded-full object-cover mr-4"
          />
        )}
        <h1 className="text-3xl font-bold">{profile.name || "No name set"}</h1>
      </div>

      {/* Edit-knapp */}
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="bg-Blue_Chill text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mb-6"
      >
        Edit Profile
      </button>

      {/* Booking info */}
      <div className="mt-6 pl-16">
        <h2 className="text-2xl font-semibold mb-2">Your Bookings</h2>
        {profile.bookings && profile.bookings.length > 0 ? (
          <ul className="space-y-2">
            {profile.bookings.map((booking) => (
              <li key={booking.id} className="p-3 border rounded">
                <p className="font-semibold">{booking.venueName}</p>
                <p>
                  {booking.dateFrom} - {booking.dateTo}
                </p>
                <p>Guests: {booking.guests}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings yet.</p>
        )}
      </div>

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
