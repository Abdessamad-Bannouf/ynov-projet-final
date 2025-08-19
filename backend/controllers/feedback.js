const Feedback = require('../models/feedback');
const Interview = require('../models/interview');
const prisma = require('../prisma/prisma');

exports.create = async (req, res) => {
    try {
        const { interviewId: interviewIdRaw, comments } = req.body;

        // ⚠️ le reviewerId vient de l’auth (middleware), jamais du body
        const reviewerIdRaw = req.user?.id; // ex. mis par ton middleware JWT
        const interviewId = Number(interviewIdRaw);
        const reviewerId = Number(reviewerIdRaw);

        if (!interviewId || !Number.isInteger(interviewId)) {
            return res.status(400).json({ error: "interviewId invalide." });
        }
        if (!reviewerId || !Number.isInteger(reviewerId)) {
            return res.status(401).json({ error: "Utilisateur non authentifié." });
        }

        // 1) Existence
        const [interview, reviewer] = await Promise.all([
            prisma.interview.findUnique({ where: { id: interviewId } }),
            prisma.user.findUnique({ where: { id: reviewerId } }),
        ]);

        if (!interview) {
            return res.status(400).json({ error: "L'entretien spécifié n'existe pas." });
        }
        if (!reviewer) {
            return res.status(400).json({ error: "L'utilisateur connecté n'existe pas en base." });
        }

        // 2) Unicité (tu as @@unique([interviewId, reviewerId]) dans le schéma)
        const already = await prisma.feedback.findUnique({
            where: { interviewId_reviewerId: { interviewId, reviewerId } },
        });
        if (already) {
            return res.status(409).json({ error: "Feedback déjà déposé pour cet entretien par cet utilisateur." });
        }

        // 3) Création via relations (plus clair que passer les IDs bruts)
        const feedback = await prisma.feedback.create({
            data: {
                comments: comments ?? null,
                interview: { connect: { id: interviewId } },
                reviewer: { connect: { id: reviewerId } },
            },
        });

        return res.status(201).json(feedback);
    } catch (error) {
        console.error(error);
        if (error.code === 'P2003') {
            return res.status(400).json({
                error: "Clé étrangère invalide (entretien ou utilisateur inexistant).",
            });
        }
        if (error.code === 'P2002') {
            // violation de l'unicité @@unique([interviewId, reviewerId])
            return res.status(409).json({ error: "Feedback déjà existant pour cet entretien/utilisateur." });
        }
        return res.status(500).json({ error: "Erreur lors de l'enregistrement du feedback." });
    }
};

exports.showAll = async (req, res) => {
    try {
        const feedbacks = await Feedback.findAll();
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des feedbacks." });
    }
};

exports.show = async (req, res) => {
    const { id } = req.params;
    try {
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ error: "Feedback non trouvé." });
        }
        res.status(200).json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération du feedback." });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { comments } = req.body;

    try {
        const feedback = await Feedback.update(id, { comments });

        res.status(200).json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la mise à jour du feedback." });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const existing = await Feedback.findById(id);

        if (!existing) {
            return res.status(404).json({ error: "Feedback non trouvé." });
        }

        await Feedback.delete(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la suppression du feedback." });
    }
};

exports.getFeedbacksByInterview = async (req, res) => {
    try {
        const { interviewId } = req.params;
        const { skip, page, pageSize } = req.pagination;

        const [feedbacks, total] = await Promise.all([
            Feedback.getByInterview(interviewId, skip, pageSize),
            Feedback.countByInterview(interviewId),
        ]);

        res.status(200).json({
            data: feedbacks,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des feedbacks." });
    }
};

exports.getFeedbacksByReviewer = async (req, res) => {
    try {
        const { reviewerId } = req.params;
        const { skip, page, pageSize } = req.pagination;

        const [feedbacks, total] = await Promise.all([
            Feedback.getByReviewer(reviewerId, skip, pageSize),
            Feedback.countByReviewer(reviewerId),
        ]);

        res.status(200).json({
            data: feedbacks,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des feedbacks du recruteur." });
    }
};
