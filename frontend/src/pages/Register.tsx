import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const { login } = useAuth(); // login(token) depuis ton AuthContext
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
        role: "user" as 'admin'|'rh'|'recruiter'|'user',
    });
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        try {
            setLoading(true);
            const { token } = await registerApi(form);
            login(token);               // ➜ sauvegarde token + header Authorization
            navigate("/interviews");    // ➜ redirection après inscription
        } catch (e: any) {
            const msg = e?.response?.data?.message || e?.response?.data?.error || "Inscription impossible";
            setErr(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white border rounded-xl p-6 shadow">
            <h1 className="text-2xl font-bold mb-4">Créer un compte</h1>

            {err && <div className="mb-3 text-red-600">{err}</div>}

            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={onChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="nom@domaine.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Mot de passe</label>
                    <input
                        name="password"
                        type="password"
                        minLength={6}
                        required
                        value={form.password}
                        onChange={onChange}
                        className="w-full border rounded px-3 py-2"
                        placeholder="••••••••"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Rôle</label>
                    <select
                        name="role"
                        value={form.role}
                        onChange={onChange}
                        className="w-full border rounded px-3 py-2 bg-white"
                    >
                        <option value="user">Utilisateur</option>
                        <option value="recruiter">Recruteur</option>
                        <option value="rh">RH</option>
                        <option value="admin">Admin</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                        (Tu peux limiter l’accès à certains écrans via <code>RoleGate</code>.)
                    </p>
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white rounded px-4 py-2"
                >
                    {loading ? "Création..." : "S’inscrire"}
                </button>
            </form>

            <p className="mt-4 text-sm text-gray-600">
                Déjà un compte ?{" "}
                <Link to="/login" className="text-blue-600 underline">
                    Se connecter
                </Link>
            </p>
        </div>
    );
}
