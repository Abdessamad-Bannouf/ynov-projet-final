import { useState } from "react";
import { createInterview } from "../api/interviews";

export default function CreateInterview() {
    const [form, setForm] = useState({
        date: "",
        location: "",
        candidateId: "",
        recruiterId: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createInterview({
            date: form.date,
            location: form.location,
            candidateId: Number(form.candidateId),
            recruiterId: Number(form.recruiterId),
        });
        alert("Entretien créé !");
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <input
                name="date"
                type="datetime-local"
                className="border p-2"
                onChange={handleChange}
                required
            />
            <input
                name="location"
                placeholder="Lieu"
                className="border p-2"
                onChange={handleChange}
            />
            <input
                name="candidateId"
                placeholder="ID du candidat"
                className="border p-2"
                onChange={handleChange}
                required
            />
            <input
                name="recruiterId"
                placeholder="ID du recruteur"
                className="border p-2"
                onChange={handleChange}
                required
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Créer
            </button>
        </form>
    );
}
