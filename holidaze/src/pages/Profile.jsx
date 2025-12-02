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
      let data;
      if (isVenueManager) {
        data = await getManagerProfile(username);

        // Hent også egne bookings som kunde
        const customerBookings = await getUserProfileWithBookings(username);
        data.bookings = customerBookings.bookings || [];
      } else {
        data = await getUserProfileWithBookings(username);
      }
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
        <div className="h-40 sm:h-56 md:h-80 mb-4 overflow-hidden md:rounded-br-full ">
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

      {/* Profile Info */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 px-4 md:px-16 -mt-16 md:-mt-20">
        {profile.avatar?.url && (
          <img
            src={profile.avatar.url}
            alt={profile.avatar.alt || "User avatar"}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mr-4"
          />
        )}
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold pt-1.5 md:pt-20">
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
      <div className="container mx-auto px-4 md:px-16">
        {/* VENUE MANAGER */}
        {isVenueManager && (
          <>
            {/* My Venues */}
            <section className="mt-16 md:mt-30">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                My Venues
              </h2>
              <hr className="my-4" />

              {profile.venues?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                  You don't have any venues yet.
                </p>
              )}
            </section>

            {/* Bookings on my venues */}
            {profile.bookedVenues?.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">
                  Bookings on My Venues
                </h2>
                <hr className="my-4" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
            {/* Upcoming Bookings as managers */}
            <section className="mt-16 md:mt-30">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                Your next adventure
              </h2>
              <hr className="my-4" />

              {upcomingBookings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                <p className="text-(--text-sub)">No upcoming bookings.</p>
              )}
            </section>
          </>
        )}

        {/* CUSTOMER VIEW */}
        {!isVenueManager && (
          <>
            {/* Upcoming */}
            <section className="mt-16 md:mt-30">
              <h2 className="text-xl md:text-2xl font-semibold mb-2">
                Your next adventure
              </h2>
              <hr className="my-4" />

              {upcomingBookings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                <p className="text-(--text-sub)">No upcoming bookings.</p>
              )}
            </section>

            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <section className="mt-16 md:mt-30">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">
                  Past Bookings
                </h2>
                <hr className="my-4" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
              </section>
            )}
          </>
        )}
      </div>

      {/* Edit Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
