import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

type Props = {
    allow: Array<'admin'|'rh'|'recruiter'|'user'>;
    children: ReactNode;
    fallback?: ReactNode;
};

export default function RoleGate({ allow, children, fallback = <div className="p-4 text-red-600">Accès refusé</div> }: Props) {
    const { user } = useAuth(); // { id, email, role } | null
    if (!user) return <div className="p-4">Vérification en cours…</div>;
    return allow.includes(user.role as any) ? <>{children}</> : <>{fallback}</>;
}