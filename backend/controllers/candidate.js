const prisma = require('../prisma/prisma');

// util
function toInt(v) {
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? null : n;
}

exports.create = async (req, res) => {
    try {
        const { name, email, experience } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: "Les champs 'name' et 'email' sont requis." });
        }

        const created = await prisma.candidate.create({
            data: {
                name,
                email,
                experience: typeof experience === 'number' ? experience : undefined,
            },
        });

        return res.status(201).json(created);
    } catch (err) {
        // 🔴 doublon email → 409
        if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
            return res.status(409).json({ error: "Email déjà utilisé." });
        }
        console.error(err);
        return res.status(500).json({ error: "Erreur serveur lors de la création du candidat." });
    }
};

exports.showAll = async (req, res) => {
    try {
        const page = Number(req.query.page ?? 1);
        const pageSize = Number(req.query.pageSize ?? 10);
        const skip = (page - 1) * pageSize;

        const q = (req.query.q ?? '').toString().trim();
        const where = q
            ? {
                OR: [
                    { name:  { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } },
                ],
            }
            : {};

        const [rows, total] = await Promise.all([
            prisma.candidate.findMany({ where, skip, take: pageSize }),
            prisma.candidate.count({ where }),
        ]);

        return res.status(200).json({
            data: rows,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur serveur lors de la récupération des candidats." });
    }
};

exports.show = async (req, res) => {
    try {
        const id = toInt(req.params.id);
        if (!id) return res.status(400).json({ error: "ID invalide." });

        const cand = await prisma.candidate.findUnique({ where: { id } });
        if (!cand) return res.status(404).json({ error: "Candidat non trouvé." });

        return res.status(200).json(cand);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur serveur lors de la récupération du candidat." });
    }
};

exports.update = async (req, res) => {
    try {
        const id = toInt(req.params.id);
        if (!id) return res.status(400).json({ error: "ID invalide." });

        const { name, email, experience } = req.body;

        const updated = await prisma.candidate.update({
            where: { id },
            data: {
                name: name ?? undefined,
                email: email ?? undefined,
                experience: typeof experience === 'number' ? experience : undefined,
            },
        });

        return res.status(200).json(updated);
    } catch (err) {
        if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
            return res.status(409).json({ error: "Email déjà utilisé." });
        }
        console.error(err);
        return res.status(500).json({ error: "Erreur serveur lors de la mise à jour du candidat." });
    }
};

exports.delete = async (req, res) => {
    try {
        const id = toInt(req.params.id);
        if (!id) return res.status(400).json({ error: "ID invalide." });

        await prisma.candidate.delete({ where: { id } });
        return res.status(204).send(); // ✅ attendu par les tests
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur serveur lors de la suppression du candidat." });
    }
};