const Interview = require('../models/interview');
const Feedback = require('../models/feedback');

exports.showAll = async (req, res) => {
    try {
        const interviews = await Interview.showAll({
            include: {
                candidate: true,
                recruiter: true,
                feedbacks: true,
            },
        });
        res.status(200).json(interviews);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des entretiens' });
    }
}

exports.show = async (req, res) => {
    const { id } = req.params;

    try {
        const interview = await Interview.show(id);

        if (!interview) {
            return res.status(404).json({ error: "Entretien non trouvé" });
        }

        res.status(200).json(interview);
    } catch (error) {
        console.error('Erreur lors de la récupération de l’entretien :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de l’entretien' });
    }
};

exports.create = async (req, res) => {
    try {
        const {
            date,
            location,
            candidateId,
            recruiterId,
            calendarEventId
        } = req.body;

        const parsedDate = new Date(date);
        if (!date || isNaN(parsedDate)) {
            return res.status(400).json({ error: "Le champ 'date' est requis et doit être une date valide." });
        }

        const interview = await Interview.create({
            date: parsedDate,
            location,
            candidateId,
            recruiterId,
            calendarEventId
        });

        res.status(201).json(interview);
    } catch (error) {
        console.error('Erreur lors de la création de l’entretien :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la création de l’entretien' });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const {
        date,
        location,
        candidateId,
        recruiterId,
        calendarEventId
    } = req.body;

    try {
        const updated = await Interview.update(id, {
            date: date ? new Date(date) : undefined,
            location,
            candidateId,
            recruiterId,
            calendarEventId
        });

        res.status(200).json(updated);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l’entretien :', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l’entretien' });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    const interviewId = parseInt(id);

    try {
        // Vérifie si l’entretien existe
        const existingInterview = await Interview.findById(interviewId);

        if (!existingInterview) {
            return res.status(404).json({ error: 'Entretien non trouvé' });
        }

        // Supprime les feedbacks liés
        await Feedback.deleteManyByInterviewId(interviewId);

        // Supprime l’entretien
        await Interview.delete(interviewId);

        res.status(204).send();
    } catch (error) {
        console.error('Erreur lors de la suppression de l’entretien :', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l’entretien' });
    }
};

