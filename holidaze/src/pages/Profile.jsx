// Profile for both customers and venue managers

import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isVenueManager = user.venueManager || false;

  const fetchProfile = useCallback(async () => {
    if (!username) return;
    try {
      setLoading(true);
      setError(null);
      let data;
      if (isVenueManager) {
        data = await getManagerProfile(username);

        const customerBookings = await getUserProfileWithBookings(username);
        data.bookings = customerBookings.bookings || [];
      } else {
        data = await getUserProfileWithBookings(username);
      }
      setProfile(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [username, isVenueManager]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSaveProfile = async (updateData) => {
    await updateProfile(username, updateData);
    await fetchProfile();
    setIsEditModalOpen(false);
  };

  const handleEditVenue = (venue) => {
    navigate(`/edit-venue/${venue.id}`);
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
      {/* Error message for profile loading only */}
      {error && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 text-(--color-error) px-6 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}

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
        className="absolute top-4 left-4 text-(--text-sub) bg-[var(--bg-header)] opacity-80 rounded-2xl w-30 font-semibold cursor-pointer text-xs md:text-base"
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
          <h1 className="text-base sm:text-base md:text-5xl font-bold pt-1.5 md:pt-20">
            {profile.name || "No name set"}
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
        {/* VENUE MANAGER */}
        {isVenueManager && (
          <>
            {/* My Venues */}
            <section className="mt-16 md:mt-30">
              <h2 className="text-sm md:text-2xl font-semibold mb-2">
                My Venues
              </h2>
              <hr className="my-4 mb-10" />

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
                <p className="text-(--text-sub) -mt-5">
                  You don't have any venues yet.
                </p>
              )}
            </section>

            {/* Bookings on my venues */}
            <section className="mt-16 md:mt-30">
              <h2 className="text-sm md:text-2xl font-semibold mb-2">
                Bookings
              </h2>
              <hr className="my-4 mb-10" />

              {profile.venueBookings?.length > 0 ? (
                <div className="space-y-4">
                  {profile.venueBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-(--bg-header) rounded-lg p-4 shadow-md"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Venue Info */}
                        <div className="md:col-span-1">
                          <h3 className="text-xs md:text-2xl font-semibold mb-2">
                            {booking.venue.name}
                          </h3>
                          {booking.venue.media?.[0]?.url && (
                            <img
                              src={booking.venue.media[0].url}
                              alt={booking.venue.name}
                              className="w-full h-32 object-cover rounded"
                            />
                          )}
                        </div>

                        {/* Booking Details */}
                        <div className="md:col-span-1">
                          <h4 className="font-semibold mb-2 text-(--text-body)">
                            Booking Details
                          </h4>
                          <p className="text-xs sm:text-xs md:text-base text-(--text-sub)">
                            <strong>Check-in:</strong>{" "}
                            {new Date(booking.dateFrom).toLocaleDateString()}
                          </p>
                          <p className="text-xs sm:text-xs md:text-base text-(--text-sub)">
                            <strong>Check-out:</strong>{" "}
                            {new Date(booking.dateTo).toLocaleDateString()}
                          </p>
                          <p className="text-xs sm:text-xs md:text-base text-(--text-sub)">
                            <strong>Guests:</strong> {booking.guests}
                          </p>
                          <p className="text-xs sm:text-xs md:text-base text-(--text-sub) mt-2">
                            <strong>Created:</strong>{" "}
                            {new Date(booking.created).toLocaleDateString()}
                          </p>
                        </div>

                        {/* Customer Info */}
                        <div className="md:col-span-1">
                          <h4 className="font-semibold mb-2 text-(--text-body)">
                            Customer Information
                          </h4>
                          {booking.customer ? (
                            <Link
                              to={`/profile/${booking.customer.name}`}
                              className="flex items-center gap-2 mb-2 p-2 rounded hover:bg-gray-100 transition cursor-pointer"
                            >
                              {booking.customer.avatar?.url && (
                                <img
                                  src={booking.customer.avatar.url}
                                  alt={booking.customer.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              )}
                              <div>
                                <p className="text-xs sm:text-xs md:text-base font-semibold text-primary">
                                  {booking.customer.name}
                                </p>
                                <p className="text-xs sm:text-xs md:text-sm text-(--text-sub)">
                                  {booking.customer.email}
                                </p>
                              </div>
                            </Link>
                          ) : (
                            <p className="text-xs sm:text-xs md:text-base text-(--text-sub)">
                              Customer information not available
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-(--text-sub) -mt-5 mb-30">
                  You don't have any bookings at the moment.
                </p>
              )}
            </section>
          </>
        )}

        {/* CUSTOMER VIEW */}
        {!isVenueManager && (
          <>
            {/* Upcoming */}
            <section className="mt-16 md:mt-30">
              <h2 className="text-sm md:text-2xl font-semibold mb-2">
                Your next adventure
              </h2>
              <hr className="my-4 mb-10" />

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
                <p className="text-(--text-sub) -mt-5">
                  You don't have any bookings at the moment.
                </p>
              )}
            </section>
            {/* Past Bookings */}
            <section className="mt-16 md:mt-30">
              <h2 className="text-sm md:text-2xl font-semibold mb-2">
                Previous bookings
              </h2>
              <hr className="my-4 mb-10" />

              {pastBookings.length > 0 ? (
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
              ) : (
                <p className="text-(--text-sub) -mt-5 mb-30">
                  You don't have any previous bookings.
                </p>
              )}
            </section>
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
