import api from "./api";

export const getCandidates = async (page = 1, limit = 10) => {
    const res = await api.get(`/candidates?page=${page}&limit=${limit}`);
    return res.data;
};

export const getCandidateById = async (id: number) => {
    const res = await api.get(`/candidates/${id}`);
    return res.data;
};
