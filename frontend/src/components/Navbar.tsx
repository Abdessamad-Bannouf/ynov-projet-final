import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LinkItem({ to, label }: { to: string; label: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm ${
                    isActive ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-100"
                }`
            }
        >
            {label}
        </NavLink>
    );
}

export default function Navbar() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="border-b bg-white">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <NavLink to="/interviews" className="font-bold text-lg">
                    RH App
                </NavLink>

                <nav className="flex items-center gap-2">
                    <LinkItem to="/interviews" label="Entretiens" />
                    <LinkItem to="/interviews/create" label="Créer un entretien" />
                    <LinkItem to="/candidates" label="Candidats" />
                </nav>

                <div className="flex items-center gap-2">
                    {!token ? (
                        <NavLink
                            to="/login"
                            className="px-3 py-2 rounded-md text-sm bg-blue-600 text-white"
                        >
                            Se connecter
                        </NavLink>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
                        >
                            Se déconnecter
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
