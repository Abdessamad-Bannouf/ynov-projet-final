import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCandidateById } from "../api/candidates";

export default function CandidateDetail() {
    const { id } = useParams();
    const [candidate, setCandidate] = useState<any>(null);

    useEffect(() => {
        if (id) {
            getCandidateById(Number(id)).then(setCandidate);
        }
    }, [id]);

    if (!candidate) return <p>Chargement...</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{candidate.name}</h2>
            <p>Email : {candidate.email}</p>
            <p>Téléphone : {candidate.phone}</p>
            <p>Expérience : {candidate.experience} ans</p>
            <p>Compétences : {candidate.skills?.join(", ")}</p>
        </div>
    );
}