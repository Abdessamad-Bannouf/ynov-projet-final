// src/components/GoogleCalendarConnect.tsx
import { useState } from "react";
import { goToGoogleLogin, getGoogleAuthUrl } from "../api/calendars";

export default function GoogleCalendarConnect() {
    const [loading, setLoading] = useState(false);

    const handleConnect = async () => {
        setLoading(true);
        try {
            // Variante A: ton back redirige lui-même → va direct
            goToGoogleLogin();

            // Variante B si ton back renvoie une URL (décommente si c'est ton cas)
            // const url = await getGoogleAuthUrl();
            // window.location.href = url;
        } catch (e) {
            alert("Impossible d'initier la connexion Google.");
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleConnect}
            disabled={loading}
            className="bg-red-600 text-white px-3 py-2 rounded"
        >
            {loading ? "Ouverture..." : "Connecter Google Calendar"}
        </button>
    );
}
