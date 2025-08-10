import axios from "axios";

const API_URL = "http://localhost:3000/api/feedbacks";


// GET feedbacks par interview
export const fetchFeedbacks = async (interviewId: number) => {
    const res = await axios.get(`${API_URL}?interviewId=${interviewId}`);
    return res.data;
};

// POST feedback
export const createFeedback = async (data: {
    interviewId: number;
    reviewerId: number;
    comments: string;

}) => {
    const res = await axios.post(`${API_URL}`, data);
    return res.data;
};