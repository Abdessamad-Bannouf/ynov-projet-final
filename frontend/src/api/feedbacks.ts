import axios from "axios";
const API_URL = "http://localhost:3000/api";

const unwrapList = (payload: any) =>
    Array.isArray(payload) ? payload : (payload?.data ?? []);

export const fetchFeedbacks = async (interviewId: number) => {
    const res = await axios.get(`${API_URL}/feedbacks/interviews/${interviewId}`, {
        params: { interviewId }
    });
    return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
};

export const createFeedback = async (data: {
    interviewId: number;
    reviewerId: number;
    comments: string;
}) => {
    const res = await axios.post(`${API_URL}/feedbacks`, data);
    return res.data?.data ?? res.data;
};