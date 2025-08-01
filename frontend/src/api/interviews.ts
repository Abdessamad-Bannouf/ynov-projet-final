export const getInterviews = async () => {
    const res = await axios.get(`${API}/interviews`);
    return res.data;
};