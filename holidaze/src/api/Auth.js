import { API_AUTH_LOGIN } from "./constants.mjs";
import { API_AUTH_REGISTER } from "./constants.mjs";

export async function register(email, password, name, venueManager = false) {
    const response = await fetch(API_AUTH_REGISTER, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            venueManager: venueManager
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.errors?.[0]?.message || "Registration failed";
        throw new Error(message);
    }

    const data = await response.json();
    return data.data;
}


import { getBasicProfile, getManagerProfile, getUserProfileWithBookings } from "./profiles.mjs";

export async function login(email, password) {
    const response = await fetch(API_AUTH_LOGIN, {
        method: "POST",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.errors?.[0]?.message || "Login failed");
    }

    const data = await response.json();
    const user = data.data;

    localStorage.setItem("accessToken", user.accessToken);
    localStorage.setItem("username", user.name);

    const basicProfile = await getBasicProfile(user.name);

    const profileData = basicProfile.venueManager
        ? await getManagerProfile(user.name)
        : await getUserProfileWithBookings(user.name);

    localStorage.setItem("user", JSON.stringify(profileData));

    return profileData;
}
