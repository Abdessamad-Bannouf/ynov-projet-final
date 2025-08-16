// src/pages/InterviewsList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInterviews } from "../api/interviews";

type Interview = {
    id: number;
    date: string;
    location?: string | null;
    candidateId?: number;
    recruiterId?: number;
    candidate?: { id: number; name?: string | null; email?: string | null };
    recruiter?: { id: number; email?: string | null };
};

export default function InterviewsList() {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const list = await getInterviews();
                setInterviews(Array.isArray(list) ? list : (list as any).data ?? []);
            } catch (e) {
                setError("Impossible de charger les entretiens.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div className="p-6">Chargement…</div>;
    if (error)   return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Entretiens</h2>

            {interviews.length === 0 ? (
                <p>Aucun entretien pour le moment.</p>
            ) : (
                <ul className="space-y-2">
                    {interviews.map((i) => (
                        <li key={i.id} className="border p-3 rounded shadow">
                            <p><strong>Date :</strong> {i.date ? new Date(i.date).toLocaleString() : "—"}</p>
                            <p><strong>Lieu :</strong> {i.location || "—"}</p>
                            <p>
                                <strong>Candidat :</strong>{" "}
                                {i.candidate?.name || i.candidate?.email || i.candidateId || "—"}
                            </p>
                            <p>
                                <strong>Recruteur :</strong>{" "}
                                {i.recruiter?.email || i.recruiterId || "—"}
                            </p>
                            <Link to={`/interviews/${i.id}`} className="text-blue-600 underline">
                                Voir le détail
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
