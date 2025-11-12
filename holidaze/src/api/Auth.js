import { API_AUTH_LOGIN } from "./constants.mjs";
import { API_AUTH_REGISTER } from "./constants.mjs";

export async function register(email, password, name, venueManager = false) {
    const data = await fetch(API_AUTH_REGISTER, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            venueManager: venueManager // Add this
        })
    });

    if (data.status === 201) {
        window.location.replace('/login');
        alert('Welcome! You will now be sent to the login page.');
    } else {
        throw new Error('Registration failed');
    }
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



    if (data.status === 200) {
        const tech = await data.json();
        const token = tech.data.accessToken;
        const name = tech.data.name;
        const userDate = tech.data;

        localStorage.setItem('accessToken', token);
        localStorage.setItem('username', name);
        localStorage.getItem('user', JSON.stringify(userDate));
        window.location.replace('/');
    } else {
        document.getElementById('error_message_login').textContent = 'Failed to login. Email address or password is wrong. Please try again'
    }

}