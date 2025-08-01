import axios from "axios";

const API = "http://localhost:3000/api";

export const getCandidates = async (page = 1, limit = 10) => {
    const res = await axios.get(`${API}/candidates?page=${page}&limit=${limit}`);
    return res.data;
};

export const getCandidateById = async (id: number) => {
    const res = await axios.get(`${API}/candidates/${id}`);
    return res.data;
};