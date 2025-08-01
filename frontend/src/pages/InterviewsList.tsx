import { useEffect, useState } from "react";
import { getInterviews } from "../api/interviews";

export default function InterviewsList() {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        getInterviews().then((res) => {
            setInterviews(res.data);
        });
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Entretiens</h2>
            <ul className="space-y-2">
                {interviews.map((i: any) => (
                    <li key={i.id} className="border p-3 rounded shadow">
                        <p>Date : {new Date(i.date).toLocaleString()}</p>
                        <p>Candidat ID : {i.candidateId}</p>
                        <p>Recruteur ID : {i.recruiterId}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
