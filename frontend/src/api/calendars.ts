import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

export async function getCalendarStatus() {
    const res = await api.get("/calendars/status");
    return res.data as { connected: boolean };
}

export async function createCalendarEvent(payload: {
    interviewId: number;
    summary: string;
    description?: string;
    start: string;
    end: string;
    location?: string;
    attendees?: string[];
}) {
    const res = await api.post("/calendars/create", payload);
    return res.data as { eventId: string; htmlLink?: string };
}

export async function updateCalendarEvent(payload: {
    interviewId: number;
    eventId: string;
    summary?: string;
    description?: string;
    start?: string;
    end?: string;
    location?: string;
    attendees?: string[];
}) {
    const res = await api.post("/calendars/update", payload);
    return res.data;
}

export function goToGoogleLogin() {
    window.location.href = "http://localhost:3000/api/calendars/login";
}
