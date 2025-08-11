import { useEffect, useState } from "react";
import { fetchFeedbacks, createFeedback } from "../api/feedbacks";

interface Feedback {
    id: number;
    comments: string;
    reviewer: { email: string };
}

export default function FeedbackSection({ interviewId, reviewerId }: {
    interviewId: number;
    reviewerId: number;
}) {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [comments, setComments] = useState("");
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        fetchFeedbacks(interviewId).then((arr) => {
            setFeedbacks(Array.isArray(arr) ? arr : []);
            if (arr?.some?.((fb: any) => fb?.reviewer?.id === reviewerId)) {
                setAlreadySubmitted(true);
            }
        }).catch((e)=>console.error('fetchFeedbacks error', e));
    }, [interviewId, reviewerId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newFb = await createFeedback({ interviewId, reviewerId, comments });
            setFeedbacks((prev) => [...prev, newFb]);
            setAlreadySubmitted(true);
            setComments("");
            setSuccessMessage("✅ Votre feedback a bien été enregistré.");
        } catch (err) {
            alert("Feedback déjà soumis ou erreur serveur.");
        }
    };

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Feedbacks</h2>

            <ul className="mb-4">
                {(feedbacks ?? [])
                    .filter((fb: any) => !!fb?.reviewer)
                    .map((fb: any) => (
                        <li key={fb.id} className="border-b py-2">
                            <strong>{fb.reviewer?.email ?? "Anonyme"}</strong> : {fb.comments}
                        </li>
                    ))}
            </ul>

            {!alreadySubmitted && (
                <form onSubmit={handleSubmit} className="space-y-2">
                    <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Votre retour ici..."
                        className="border p-2 w-full"
                        required
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded">
                        Envoyer le feedback
                    </button>
                </form>
            )}

            {(feedbacks ?? []).length === 0 && (
                <p className="text-gray-500 mb-4">Aucun feedback pour le moment.</p>
            )}

            {successMessage && (
                <p className="text-green-600 mt-2">{successMessage}</p>
            )}

            {alreadySubmitted && !successMessage && (
                <p className="text-green-600">✅ Feedback déjà soumis</p>
            )}
        </div>
    );
}
