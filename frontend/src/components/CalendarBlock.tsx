import { useEffect, useMemo, useState } from "react";
import {
    getCalendarStatus,
    goToGoogleLogin,
    createCalendarEvent,
} from "../api/calendars";

// Typage léger de l'entretien tel qu'utilisé ici
type InterviewLike = {
    id: number;
    date: string; // ISO ou parsable par new Date()
    location?: string | null;
    candidate?: { name?: string | null; email?: string | null } | null;
    recruiter?: { email?: string | null } | null;

    // Champs côté BDD (après création d'event)
    calendarEventId?: string | null;
    calendarHtmlLink?: string | null; // 👈 on s'appuie sur celui-ci pour ouvrir l'évènement
};

type Props = {
    interview: InterviewLike;
    // On remonte les infos pour MAJ locale dans le parent (eventId + htmlLink)
    onEventCreated?: (eventId: string, htmlLink?: string | null) => void;
};

export default function CalendarBlock({ interview, onEventCreated }: Props) {
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    // Validité de la date (désactive le bouton si invalide)
    const startISO = useMemo(() => {
        const d = new Date(interview?.date);
        return isNaN(d.getTime()) ? null : d.toISOString();
    }, [interview?.date]);

    useEffect(() => {
        (async () => {
            try {
                const s = await getCalendarStatus();
                setConnected(!!s.connected);
            } catch (e) {
                console.error("getCalendarStatus error:", e);
                setConnected(false);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div>Google Calendar : vérification…</div>;

    // ✅ Si on a déjà le lien en BDD, on l'affiche (chemin le plus fiable)
    if (interview?.calendarHtmlLink) {
        return (
            <a
                className="text-blue-600 underline"
                href={interview.calendarHtmlLink}
                target="_blank"
                rel="noreferrer"
            >
                Voir l’événement dans Google Calendar
            </a>
        );
    }

    // Si pas connecté, on propose la connexion
    if (!connected) {
        return (
            <button
                onClick={goToGoogleLogin}
                className="bg-red-600 text-white px-4 py-2 rounded"
            >
                Connecter Google Calendar
            </button>
        );
    }

    const handleCreate = async () => {
        try {
            if (!startISO) {
                alert("Date d’entretien invalide — impossible de créer l’événement.");
                return;
            }
            setCreating(true);

            const endISO = new Date(
                new Date(interview.date).getTime() + 60 * 60 * 1000
            ).toISOString(); // +1h

            const summary = `Entretien – ${
                interview?.candidate?.name ?? "Candidat"
            }`;
            const attendees = [
                interview?.candidate?.email,
                interview?.recruiter?.email,
            ]
                .filter(Boolean)
                .map(String);

            const { eventId, htmlLink } = await createCalendarEvent({
                interviewId: interview.id,
                summary,
                description: "Entretien RH",
                start: startISO,
                end: endISO,
                location: interview.location ?? "",
                attendees,
            });

            // Remonter au parent pour MAJ locale (affichage du lien sans refresh)
            onEventCreated?.(eventId, htmlLink);

            if (htmlLink) window.open(htmlLink, "_blank");
            alert("Événement créé dans Google Calendar ✅");
        } catch (e: any) {
            console.error("createCalendarEvent error:", e);
            alert(e?.response?.data?.error ?? "Échec de la création d'événement");
        } finally {
            setCreating(false);
        }
    };

    return (
        <button
            onClick={handleCreate}
            disabled={creating || !startISO}
            className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
            title={!startISO ? "Date d’entretien invalide" : undefined}
        >
            {creating ? "Création…" : "Créer l’événement Google"}
        </button>
    );
}
