import FeedbackSection from "../components/FeedbackSection";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CreateFeedback() {
    const { id } = useParams<{ id: string }>();
    const interviewId = Number(id);
    const { user } = useAuth();

    if (!user) return <p>Vous devez être connecté pour laisser un feedback.</p>;
    if (!interviewId) return <p>Interview invalide.</p>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Créer un Feedback</h1>
            <FeedbackSection
                key={`${interviewId}-${user.id}`} // seulement pour React; pas envoyé à l’API
                interviewId={interviewId}
                // ❌ ne plus envoyer reviewerId au backend
            />
        </div>
    );
}
