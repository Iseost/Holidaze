import { useEffect, useState } from "react";

export default function EditProfileModal({ isOpen, onClose, profile, onSave }) {
  const [name, setName] = useState(profile?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar?.url || "");
  const [bannerUrl, setBannerUrl] = useState(profile?.banner?.url || "");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile && isOpen) {
      setName(profile.name || "");
      setAvatarUrl(profile.avatar?.url || "");
      setBannerUrl(profile.banner?.url || "");
      setSuccess("");
      setError("");
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSubmitting(true);
    setError("");
    setSuccess("");

    const updateData = {};

    if (name.trim()) updateData.name = name.trim();
    if (avatarUrl.trim())
      updateData.avatar = { url: avatarUrl.trim(), alt: "User avatar" };
    if (bannerUrl.trim())
      updateData.banner = { url: bannerUrl.trim(), alt: "User banner" };

    try {
      await onSave(updateData);
      setSuccess("Your profile has been updated!");

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-(--bg-header) p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          Edit your profile
        </h2>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 text-green-700 text-sm rounded-lg font-semibold p-3 mb-4 text-center">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm rounded-lg font-semibold p-3 mb-4 text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <p>Your Name</p>
          <input
            type="text"
            placeholder="Your name"
            className="w-full border border-(--text-body) rounded px-4 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <p>Banner Image</p>
          <input
            type="url"
            placeholder="Enter banner URL"
            className="w-full border border-(--text-body) rounded px-4 py-2"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
          />

          <p>Avatar Image</p>
          <input
            type="url"
            placeholder="Enter avatar URL"
            className="w-full border border-(--text-body) rounded px-4 py-2"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />

          <button
            className={`w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-lg transition-colors ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleSave}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>

          <button
            className="bg-[var(--text-sub)] hover:bg-gray-600 transition text-white py-2 px-4 rounded w-full mt-4"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
