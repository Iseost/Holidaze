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
        method: 'post',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    const user = data.data;

    // Save token + name first
    localStorage.setItem("accessToken", user.accessToken);

    // 1️⃣ Fetch the basic profile (this gives venueManager)
    const basicProfile = await getBasicProfile(user.name);

    localStorage.setItem("user", JSON.stringify(basicProfile));

    if (basicProfile.venueManager) {
        const manager = await getManagerProfile(user.name);
        localStorage.setItem("user", JSON.stringify(manager));
    } else {
        const customer = await getUserProfileWithBookings(user.name);
        localStorage.setItem("user", JSON.stringify(customer));
    }

    return basicProfile;
}
