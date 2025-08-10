import axios from "axios";

const API = "http://localhost:3000/api";

export const getInterviews = async (page = 1, limit = 10) => {
    const res = await axios.get(`${API}/interviews?page=${page}&limit=${limit}`);
    return res.data;
};

export const createInterview = async (interviewData: {
    date: string;
    location: string;
    candidateId: number;
    recruiterId: number;
}) => {
    const res = await axios.post(`${API}/interviews`, interviewData, { withCredentials: true });
    return res.data;
};