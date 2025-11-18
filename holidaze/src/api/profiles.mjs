import { API_KEY, API_PROFILES } from "./constants.mjs";

//Get profile with bookings

export async function getUserProfileWithBookings(username) {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(`${API_PROFILES}/${username}?_bookings=true`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch profile. Status: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        throw error;
    }
}


// updateProfile
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
