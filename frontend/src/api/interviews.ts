import axios from "axios";

const API = "http://localhost:3000/api";

export const getInterviews = async () => {
    const res = await axios.get(`${API}/interviews`);
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