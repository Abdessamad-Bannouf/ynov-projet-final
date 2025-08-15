import api from "./api";

const unwrapList = (payload: any) =>
    Array.isArray(payload) ? payload : (payload?.data ?? []);

export const fetchFeedbacks = async (interviewId: number) => {
    const res = await api.get(`/feedbacks/interviews/${interviewId}`, {
        params: { interviewId }
    });
    return Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
};

export const createFeedback = async (data: {
    interviewId: number;
    reviewerId: number;
    comments: string;
}) => {
    const res = await api.post(`/feedbacks`, data);
    return res.data?.data ?? res.data;
};