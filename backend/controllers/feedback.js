const Feedback = require('../models/feedback');

exports.createFeedback = async (req, res) => {
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
