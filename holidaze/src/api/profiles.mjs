import { API_KEY, API_PROFILES } from "./constants.mjs";


// Fetches the profile of a venue manager along with their venues and bookings
export async function getManagerProfile(username) {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(
        `${API_PROFILES}/${username}?_venues=true&_bookings=true`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Noroff-API-Key": API_KEY,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch manager profile. Status: ${response.status}`);
    }

    const { data } = await response.json();

    // Collect all bookings from all venues
    let allVenueBookings = [];
    if (data.venues && data.venues.length > 0) {
        // Fetch each venue with bookings and customer data
        const venuePromises = data.venues.map(async (venue) => {
            const venueResponse = await fetch(
                `https://v2.api.noroff.dev/holidaze/venues/${venue.id}?_bookings=true&_customer=true`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                        "X-Noroff-API-Key": API_KEY,
                    },
                }
            );

            if (venueResponse.ok) {
                const venueData = await venueResponse.json();
                return venueData.data;
            }
            return venue;
        });

        const venuesWithBookings = await Promise.all(venuePromises);

        // Extract all bookings from venues
        venuesWithBookings.forEach(venue => {
            if (venue.bookings && venue.bookings.length > 0) {
                venue.bookings.forEach(booking => {
                    allVenueBookings.push({
                        ...booking,
                        venue: {
                            id: venue.id,
                            name: venue.name,
                            media: venue.media,
                            price: venue.price,
                            location: venue.location,
                            maxGuests: venue.maxGuests,
                        }
                    });
                });
            }
        });
    }

    return {
        ...data,
        venues: data.venues || [],
        venueBookings: allVenueBookings,
        bookings: [],
    };
}

// Fetches the profile of a regular user along with their bookings and venues
export async function getUserProfileWithBookings(username) {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(
        `${API_PROFILES}/${username}?_bookings=true&_venues=true`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Noroff-API-Key": API_KEY,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch profile. Status: ${response.status}`);
    }

    const { data } = await response.json();

    return {
        ...data,
        bookings: data.bookings || [],
        venues: data.venues || [],
        venueBookings: [],
    };
}


// Updates the profile of the specified user
export async function updateProfile(username, data) {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${API_PROFILES}/${username}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erros?.[0]?.massage || "Failed to update profile");
    }
    return response.json();
}

export async function getBasicProfile(username) {
    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${API_PROFILES}/${username}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Noroff-API-Key": API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error("Could not load basic profile");
    }

    const data = await response.json();
    return data.data;
}
