const Feedback = require('../models/feedback');

exports.create = async (req, res) => {
    try {
        const { interviewId, reviewerId, comments } = req.body;

        const existing = await Feedback.exists(interviewId, reviewerId);

        if (existing) {
            return res.status(409).json({
                error: "Ce recruteur a déjà laissé un feedback pour cet entretien.",
            });
        }

        const feedback = await Feedback.create({ interviewId, reviewerId, comments });

        res.status(201).json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'enregistrement du feedback." });
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
