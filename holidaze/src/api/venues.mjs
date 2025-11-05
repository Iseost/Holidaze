//View a list of Venues.

import { API_VENUES } from "./constants.mjs";

export async function fetchVenues() {
    const response = await fetch(API_VENUES, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch venues");
    }
    const data = await response.json();
    return data;
}

//View details of a specific Venue by ID.

export async function fetchVenueById(venueId) {
    const response = await fetch(`${API_VENUES}/${venueId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch venue details");
    }
    const data = await response.json();
    return data;
}

//Create a new Venue.

export async function createVenue(venueData, token) {
    const response = await fetch(API_VENUES, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(venueData),
    });
    if (!response.ok) {
        throw new Error("Failed to create venue");
    }
    const data = await response.json();
    return data;
}

//Update an existing Venue by ID.

export async function updateVenue(venueId, venueData, token) {
    const response = await fetch(`${API_VENUES}/${venueId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(venueData),
    });
    if (!response.ok) {
        throw new Error("Failed to update venue");
    }
    const data = await response.json();
    return data;
}

//Delete a Venue by ID.

export async function deleteVenue(venueId, token) {
    const response = await fetch(`${API_VENUES}/${venueId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to delete venue");
    }
    return true;;
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



