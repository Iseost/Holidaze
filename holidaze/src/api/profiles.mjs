import { API_USERS, API_KEY } from "./constants.mjs";

export default async function userProfiles() {
    const accessToken = localStorage.getItem("accessToken");

    try {
        const response = await fetch(API_USERS, {
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
        return data;
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}