const Interview = require('../models/interview');
const Feedback = require('../models/feedback');
const Candidate = require('../models/candidate');
const prisma = require('../prisma/prisma');

exports.showAll = async (req, res) => {
    try {
        const interviews = await Interview.showAll();
        res.status(200).json(interviews);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des entretiens' });
    }
};

exports.show = async (req, res) => {
    const { id } = req.params;
    try {
        const interview = await Interview.show(id);
        if (!interview) return res.status(404).json({ error: "Entretien non trouvé" });
        res.status(200).json(interview);
    } catch (error) {
        console.error('Erreur lors de la récupération de l’entretien :', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de l’entretien' });
    }
};

exports.create = async (req, res) => {
    try {
        let {
            date,
            location,
            candidateId,
            candidateEmail,
            recruiterId,
            calendarEventId,
            calendarHtmlLink,
        } = req.body;

        // date valide
        const parsedDate = new Date(date);
        if (!date || isNaN(parsedDate)) {
            return res.status(400).json({ error: "Le champ 'date' est requis et doit être une date valide." });
        }

        // Résolution candidateId depuis candidateEmail si nécessaire
        if (!candidateId && candidateEmail) {
            const cand = await prisma.candidate.findUnique({ where: { email: candidateEmail } });
            if (!cand) {
                return res.status(400).json({ error: "Candidat introuvable pour cet email." });
            }
            candidateId = cand.id;
        }

        // Si aucun des deux n’est fourni → 400
        if (!candidateId) {
            return res.status(400).json({ error: "Le champ 'candidateId' ou 'candidateEmail' est requis." });
        }

        // 4) recruiterId : par défaut l’utilisateur connecté si disponible
        if (!recruiterId && req.auth?.id) {
            recruiterId = req.auth.id;
        }
        if (!recruiterId) {
            return res.status(400).json({ error: "Le champ 'recruiterId' est requis (ou être authentifié)." });
        }

        // création
        const interview = await prisma.interview.create({
            data: {
                date: parsedDate,
                location: location || null,
                candidateId: Number(candidateId),
                recruiterId: Number(recruiterId),
                calendarEventId: calendarEventId || null,
                calendarHtmlLink: calendarHtmlLink || null,
            },
            include: {
                candidate: { select: { id: true, name: true, email: true } },
                recruiter: { select: { id: true, email: true } },
            },
        });

        return res.status(201).json(interview);
    } catch (error) {
        console.error('Erreur lors de la création de l’entretien :', error);
        return res.status(500).json({ error: 'Erreur serveur lors de la création de l’entretien' });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const {
        date,
        location,
        candidateId,
        recruiterId,
        calendarEventId,
        calendarHtmlLink,
    } = req.body;

    try {
        const updated = await Interview.update(id, {
            date: date ? new Date(date) : undefined,
            location,
            candidateId,
            recruiterId,
            calendarEventId,
            calendarHtmlLink,
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
        const existingInterview = await Interview.show(interviewId);
        if (!existingInterview) {
            return res.status(404).json({ error: 'Entretien non trouvé' });
        }

        await Feedback.deleteManyByInterviewId(interviewId);
        await Interview.delete(interviewId);
        res.status(204).send();
    } catch (error) {
        console.error('Erreur lors de la suppression de l’entretien :', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de l’entretien' });
    }
};
