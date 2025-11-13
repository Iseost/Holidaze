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
    return data;
}


export async function login(email, password) {
    const data = await fetch(API_AUTH_LOGIN, {
        method: 'post',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });



    if (!data.ok) {
        const errorData = await data.json().catch(() => ({}));
        const message = errorData.message || "Invalid message";
        throw new Error(message);
    }

    const responseData = await data.json();
    const token = responseData.data.accessToken;
    const name = responseData.data.name;
    const userData = responseData.data;

    localStorage.setItem('accessToken', token);
    localStorage.setItem('username', name);
    localStorage.setItem('user', JSON.stringify(userData));

    return userData;

}