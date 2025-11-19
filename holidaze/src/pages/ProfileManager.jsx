import { useState, useEffect } from "react";
import EditProfileModal from "../components/EditProfileModal.jsx";
import { updateProfile, getUserProfileWithBookings } from "../api/profiles.mjs";

export default function ProfileManager() {
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
    <div className="mx-auto relative">
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

      {/* Edit-knapp */}
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="absolute top-4 left-4 text-[var(--text-sub)] font-semibold cursor-pointer"
      >
        Edit Profile
      </button>

      {/* Avatar og navn */}
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
