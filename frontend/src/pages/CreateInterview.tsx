import { useState } from "react";
import { createInterview } from "../api/interviews";
import RoleGate from "../auth/RoleGate";
import { useAuth } from "../context/AuthContext";

export default function CreateInterview() {
    const { user } = useAuth(); // { id, email, role }
    const [form, setForm] = useState({
        date: "",
        location: "",
        candidateEmail: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!form.date) return setErrorMsg("La date est requise.");
        if (!form.candidateEmail) return setErrorMsg("L'email candidat est requis.");

        try {
            setSubmitting(true);
            await createInterview({
                date: form.date,
                location: form.location || "",
                candidateEmail: form.candidateEmail,
            });
            alert("Entretien créé !");
            setForm({ date: "", location: "", candidateEmail: "" });
        } catch (err: any) {
            setErrorMsg(err?.response?.data?.error ?? "Erreur serveur.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <RoleGate allow={["rh", "recruiter", "admin"]}>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-xl">
                <h1 className="text-xl font-semibold">Créer un entretien</h1>

                {errorMsg && <p className="text-red-600">{errorMsg}</p>}

                <input
                    name="date"
                    type="datetime-local"
                    className="border p-2 w-full"
                    value={form.date}
                    onChange={handleChange}
                    required
                />

                <input
                    name="location"
                    placeholder="Lieu (optionnel)"
                    className="border p-2 w-full"
                    value={form.location}
                    onChange={handleChange}
                />

                <input
                    name="candidateEmail"
                    type="email"
                    placeholder="Email du candidat"
                    className="border p-2 w-full"
                    value={form.candidateEmail}
                    onChange={handleChange}
                    required
                />

                {user && (
                    <p className="text-sm text-gray-600">
                        Recruteur : <strong>{user.email}</strong> (ID: {user.id})
                    </p>
                )}

                <button
                    disabled={submitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
                >
                    {submitting ? "Création…" : "Créer"}
                </button>
            </form>
        </RoleGate>
    );
}
