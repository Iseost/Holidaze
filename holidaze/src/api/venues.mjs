import { API_VENUES, API_KEY } from "./constants.mjs";

//View a list of Venues.

export async function fetchVenues(accessToken, page = 1, pageSize = 9) {
    const url = `${API_VENUES}?sort=created&sortOrder=desc&page=${page}&pageSize=${pageSize}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": API_KEY,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch venues");
    return await response.json();
}


//View details of a specific Venue by ID.
export async function fetchVenueById(venueId) {
    try {
        const response = await fetch(`${API_VENUES}/${venueId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch venue details. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data); // Debug log
        return data.data; // Return data.data for consistency
    } catch (error) {
        console.error("Error fetching venue details:", error);
        throw error;
    }
}

//Create a new Venue.
export async function createVenue(venueData) {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(API_VENUES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(venueData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.errors?.[0]?.message || "Failed to create venue";
        throw new Error(message);
    }

    const data = await response.json();
    return data;
}

//Update an existing Venue by ID.
export async function updateVenue(venueId, venueData) {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${API_VENUES}/${venueId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(venueData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.errors?.[0]?.message || "Failed to update venue";
        throw new Error(message);
    }

    const data = await response.json();
    return data;
}

//Delete a Venue by ID.
export async function deleteVenue(venueId) {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${API_VENUES}/${venueId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "X-Noroff-API-Key": API_KEY,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to delete venue");
    }

    return true;
}

//Search Venues by name.
export async function searchVenuesByName(name) {
    const response = await fetch(`${API_VENUES}?name=${encodeURIComponent(name)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to search venues");
    }
    const data = await response.json();
    return data;
}