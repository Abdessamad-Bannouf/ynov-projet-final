import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getInterviewById } from "../api/interviews";
import FeedbackSection from "../components/FeedbackSection";
// IMPORTANT : on importe bien le bloc qui gère statut + création
import CalendarBlock from "../components/CalendarBlock";

type Interview = {
    id: number;
    date: string;
    location?: string;
    calendarEventId?: string | null;
    candidate?: { id: number; name: string; email: string };
    recruiter?: { id: number; email: string };
};

export default function InterviewDetail() {
    const { id } = useParams();
    const interviewId = Number(id);

    const [interview, setInterview] = useState<Interview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState<string | null>(null);

    // TODO: à récupérer via auth
    const reviewerId = 1;

    useEffect(() => {
        if (!interviewId) return;
        (async () => {
            try {
                setLoading(true);
                const raw = await getInterviewById(interviewId);
                const normalized: Interview = (raw as any)?.data ?? (raw as Interview);
                setInterview(normalized);
            } catch (e) {
                console.error("getInterviewById error:", e);
                setError("Impossible de charger l’entretien.");
            } finally {
                setLoading(false);
            }
        })();
    }, [interviewId]);

    if (loading) return <div className="p-6">Chargement…</div>;
    if (error)   return <div className="p-6 text-red-600">{error}</div>;
    if (!interview) return <div className="p-6">Entretien introuvable.</div>;

    const dateLabel =
        interview?.date && !Number.isNaN(new Date(interview.date).getTime())
            ? new Date(interview.date).toLocaleString()
            : "—";

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Entretien #{interview.id ?? "—"}</h1>
                <Link to="/interviews" className="text-blue-600 underline">← Retour</Link>
            </div>

            {/* Infos + Participants */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-xl p-4">
                    <h2 className="font-semibold mb-2">Infos</h2>
                    <p><span className="font-medium">Date :</span> {dateLabel}</p>
                    <p><span className="font-medium">Lieu :</span> {interview.location || "—"}</p>
                </div>

                <div className="border rounded-xl p-4">
                    <h2 className="font-semibold mb-2">Participants</h2>
                    <p>
                        <span className="font-medium">Candidat :</span>{" "}
                        {interview?.candidate?.name ?? "—"} ({interview?.candidate?.email ?? "—"})
                    </p>
                    <p>
                        <span className="font-medium">Recruteur :</span>{" "}
                        {interview?.recruiter?.email ?? "—"}
                    </p>
                </div>
            </div>

            {/* Google Calendar */}
            <div className="border rounded-xl p-4">
                <h2 className="font-semibold mb-3">Google Calendar</h2>
                <CalendarBlock
                    interview={interview}
                    onEventCreated={(eventId) => {
                        // MAJ locale du calendarEventId pour montrer "Voir l’événement"
                        setInterview(prev => prev ? { ...prev, calendarEventId: eventId } : prev);
                    }}
                />
            </div>

            {/* Feedbacks */}
            <div className="border rounded-xl p-4">
                <FeedbackSection interviewId={interviewId} reviewerId={reviewerId} />
            </div>
        </div>
    );
}
