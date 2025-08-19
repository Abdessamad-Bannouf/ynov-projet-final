import api from "./api";

export const getCandidates = async (page = 1, limit = 10) => {
    const res = await api.get(`/candidates?page=${page}&limit=${limit}`);
    return res.data;
};

export const getCandidateById = async (id: number) => {
    const res = await api.get(`/candidates/${id}`);
    return res.data;
};

export const createCandidate = async (payload: {
    name: string;
    email: string;
    experience: number;
    cv?: File | null;
}) => {
    const fd = new FormData();
    fd.append("name", payload.name);
    fd.append("email", payload.email);
    fd.append("experience", String(payload.experience));
    if (payload.cv) fd.append("cv", payload.cv); // <- nom "cv" important

    const res = await api.post("/candidates", fd, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};
