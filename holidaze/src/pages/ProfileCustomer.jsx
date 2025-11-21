import { useState, useEffect } from "react";
import EditProfileModal from "../components/EditProfileModal.jsx";
import { updateProfile, getUserProfileWithBookings } from "../api/profiles.mjs";

export default function ProfileCustomer() {
  const storedUser = JSON.parse(localStorage.getItem("user")); // <--- fix here
  const username = localStorage.getItem("username");

  const [profile, setProfile] = useState(storedUser || null);
  const [loading, setLoading] = useState(!storedUser);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!username || storedUser) return; // profile already loaded
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfileWithBookings(username);
      setProfile(data);
      localStorage.setItem("user", JSON.stringify(data)); // save for future reloads
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
        className="absolute top-4 left-4 text-[var(--text-sub)] font-semibold cursor-pointer"
      >
        Edit Profile
      </button>

      {/* Avatar and name */}
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

      {/* Booking info */}
      <div className="mt-30 pl-24">
        <h2 className="text-2xl font-semibold mb-2">Your next adventure</h2>
        <hr className="mt-4 mb-4 w-[590px]" />
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
          <p>You don’t have any bookings at the moment.</p>
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
