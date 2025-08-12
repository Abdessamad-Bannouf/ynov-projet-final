// src/pages/GoogleCallback.tsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

export default function GoogleCallback() {
    const [params] = useSearchParams();
    const [msg, setMsg] = useState("Vérification en cours…");

    useEffect(() => {
        setMsg(params.get("success") === "1"
            ? "Connexion Google réussie ✅"
            : "Connexion Google annulée ou échouée.");
    }, []);

    return (
        <div className="p-6 space-y-4">
            <p>{msg}</p>
            <Link className="text-blue-600 underline" to="/interviews">← Retour aux entretiens</Link>
        </div>
    );
}
