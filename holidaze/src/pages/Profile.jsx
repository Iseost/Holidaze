// Profile for both customers and venue managers

import { useState, useEffect } from "react";
import VenueCard from "../components/venue/VenueCard";
import EditProfileModal from "../components/EditProfileModal";
import {
  getUserProfileWithBookings,
  getManagerProfile,
  updateProfile,
} from "../api/profiles.mjs";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const username = localStorage.getItem("username");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isVenueManager = user.venueManager || false;

  useEffect(() => {
    if (!username) return;
    fetchProfile();
  }, [username]);

  async function fetchProfile() {
    try {
      setLoading(true);
      const data = isVenueManager
        ? await getManagerProfile(username)
        : await getUserProfileWithBookings(username);
      setProfile(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error("Error loading profile:", err);
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

  if (loading || !profile)
    return <p className="text-center py-10">Loading...</p>;

  const now = new Date();
  const upcomingBookings =
    profile.bookings?.filter((booking) => new Date(booking.dateTo) >= now) ||
    [];
  const pastBookings =
    profile.bookings?.filter((booking) => new Date(booking.dateTo) < now) || [];

  return (
    <div className="mx-auto relative">
      {profile.banner?.url && (
        <div className="h-80 mb-4 overflow-hidden rounded-br-full">
          <img
            src={profile.banner.url}
            alt={profile.banner.alt || "User banner"}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <button
        onClick={() => setIsEditModalOpen(true)}
        className="absolute top-4 left-4 text-(--text-sub) font-semibold cursor-pointer"
      >
        Edit Profile
      </button>
      <div className="flex items-center pl-16 -mt-20">
        {profile.avatar?.url && (
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || "User avatar"}
            className="w-24 h-24 rounded-full object-cover mr-4"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold pt-20">
            {profile.name || "No name set"}
          </h1>
          <p className="text-(--text-sub)">{profile.email}</p>
          {isVenueManager && (
            <span className="inline-block mt-2 bg-blue-100 text-[var(--text-sub)] text-xs px-2 py-1 rounded">
              Venue Manager
            </span>
          )}
        </div>
      </div>

      {/* Content wrapper */}
      <div className="container mx-auto px-4">
        {/* VENUE MANAGER CONTENT */}
        {isVenueManager && (
          <>
            {/* My Venues */}
            <section className="mt-20 pl-16 pr-16">
              <h2 className="text-2xl font-semibold mb-2">My Venues</h2>
              <hr className="mt-4 mb-4" />

              {profile.venues?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <p className="text-(--text-sub)">
                  You don't have any venues at the moment.
                </p>
              )}
            </section>

            {/* Booked Venues */}
            {profile.bookedVenues?.length > 0 && (
              <section className="mt-20 pl-16 pr-16">
                <h2 className="text-2xl font-semibold mb-2">
                  Bookings on My Venues
                </h2>
                <hr className="mt-4 mb-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.bookedVenues.map((booking) => (
                    <VenueCard
                      key={booking.id}
                      venue={booking.venue}
                      booking={booking}
                      clickable={true}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* CUSTOMER CONTENT */}
        {!isVenueManager && (
          <>
            {/* Upcoming Bookings */}
            <div className="mt-20 pl-16 pr-16">
              <h2 className="text-2xl font-semibold mb-2">
                Your next adventure
              </h2>
              <hr className="mt-4 mb-4" />

              {upcomingBookings.length > 0 ? (
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
                <p className="text-[var(--text-sub)]">
                  You don't have any upcoming bookings at the moment.
                </p>
              )}
            </div>

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-semibold mb-2">Past Bookings</h2>
                <hr className="mt-4 mb-4" />

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
          </>
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
