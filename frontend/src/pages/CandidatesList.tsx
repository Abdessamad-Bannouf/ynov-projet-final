import { useEffect, useState } from "react";
import { getCandidates } from "../api/candidates";

type Candidate = {
    id: number;
    name: string;
    email: string;
    experience: number;
};

export default function CandidatesList() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);

    useEffect(() => {
        getCandidates().then((res) => {
            setCandidates(res.data);
        });
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Liste des candidats</h1>
            <ul className="space-y-2">
                {candidates.map((c) => (
                    <li key={c.id} className="border p-3 rounded shadow">
                        <p className="font-semibold">{c.name}</p>
                        <p>Email : {c.email}</p>
                        <p>Expérience : {c.experience} ans</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}