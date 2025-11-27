import { API_BOOKINGS, API_KEY } from "./constants.mjs";

export const createBooking = async (bookingData) => {
    const token = localStorage.getItem("accessToken");

    try {
        const response = await fetch(API_BOOKINGS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
            },
            body: JSON.stringify(bookingData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const message = errorData.errors?.[0]?.message || 'Failed to create booking';
            throw new Error(message);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        throw error;
    }
};

export const getBookingsByUser = async (userId) => {
    const token = localStorage.getItem("accessToken");

    try {
        const response = await fetch(`${API_BOOKINGS}?userId=${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        throw error;
    }
};