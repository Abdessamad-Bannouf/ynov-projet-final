// src/pages/CandidateCreate.tsx
import React, { useState } from "react";
import { createCandidate } from "../api/candidates";

export default function CandidateCreate() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [experience, setExperience] = useState<number>(0);
    const [cv, setCv] = useState<File | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [ok, setOk] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setOk(null);
        try {
            const data = await createCandidate({ name, email, experience, cv });
            setOk("Candidat créé avec succès ✅");
            // reset
            setName(""); setEmail(""); setExperience(0); setCv(null);
            // tu peux redirect ici si tu veux (ex: navigate('/candidates'))
            // console.log(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "Erreur inattendue");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Créer un candidat</h1>

            <form onSubmit={onSubmit}>
                <div style={{ marginBottom: 12 }}>
                    <label>Nom</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ display: "block", width: "100%", padding: 8 }}
                        placeholder="Jane Doe"
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ display: "block", width: "100%", padding: 8 }}
                        placeholder="jane@example.com"
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Expérience (années)</label>
                    <input
                        type="number"
                        min={0}
                        value={experience}
                        onChange={(e) => setExperience(Number(e.target.value))}
                        style={{ display: "block", width: "100%", padding: 8 }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>CV (PDF/DOCX) — champ <code>cv</code></label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCv(e.target.files?.[0] || null)}
                    />
                </div>

                <button type="submit" style={{ backgroundColor: "#007BFF", color: "white", padding: "8px 16px", borderRadius: "4px", border: "none", cursor: "pointer" }}>
                    Créer
                </button>
                {ok && <div style={{ color: "green", marginTop: 10 }}>{ok}</div>}
                {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
            </form>
        </div>
    );
}
