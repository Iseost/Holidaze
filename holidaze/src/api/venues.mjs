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