import api from "./api";

export const getInterviews = async (page = 1, limit = 10) => {
    const res = await api.get(`/interviews?page=${page}&limit=${limit}`);
    return res.data?.data ?? res.data;
};

export const createInterview = async (interviewData: {
    date: string;
    location: string;
    candidateId: number;
    recruiterId: number;
}) => {
    const res = await api.post(`/interviews`, interviewData, { withCredentials: true });
    return res.data?.data ?? res.data;
};

const unwrap = (payload: any) => (payload?.data ?? payload);

export const getInterviewById = async (id: number) => {
    const res = await api.get(`/interviews/${id}`);
    // Accepte les 2 formats: {data: {...}} ou {...}
    return res.data?.data ?? res.data;
};