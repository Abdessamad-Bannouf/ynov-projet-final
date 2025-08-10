import FeedbackSection from "../components/FeedbackSection";
import { useEffect } from "react";

export default function CreateFeedback() {
    // Changer les variables d'en dessous pour les rendre dynamique (par exemple prends le reviewerid : personne connectée et interviewId : aller sur la page interview pour prendre l'id correspondant
    const interviewId = 8;
    const reviewerId = 1;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Créer un Feedback</h1>
            <FeedbackSection  key={`${interviewId}-${reviewerId}`}
                              interviewId={interviewId}
                              reviewerId={reviewerId}
            />
        </div>
    );
}