//Booking api to create a new booking

import { API_BOOKINGS } from "../config/apiConfig.mjs";

export async function createBooking(bookingData, token) {
    const response = await fetch(API_BOOKINGS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
        throw new Error("Failed to create booking");
    }
    const data = await response.json();
    return data;
}