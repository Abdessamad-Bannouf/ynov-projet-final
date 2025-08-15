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
        const { date, location, candidateEmail } = req.body;

        // Valide la date
        const parsedDate = new Date(date);
        if (!date || Number.isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: "Le champ 'date' est requis et doit être une date valide." });
        }

        // Récupère le recruteur depuis le JWT
        if (!req.auth?.id) {
            return res.status(401).json({ error: "Non authentifié" });
        }
        const recruiterId = Number(req.auth.id);

        // Résout l'ID du candidat à partir de l'email
        if (!candidateEmail) {
            return res.status(400).json({ error: "Le champ 'candidateEmail' est requis." });
        }
        const candidate = await prisma.candidate.findUnique({
            where: { email: candidateEmail },
            select: { id: true, email: true, name: true },
        });
        if (!candidate) {
            return res.status(400).json({ error: "Candidat introuvable pour cet email." });
        }

        // Crée l’entretien
        const interview = await Interview.create(
            {
                date: parsedDate,
                location: location ?? null,
                candidateId: candidate.id,
                recruiterId,
                calendarEventId: null,
            },
            {
                candidate: { select: { id: true, name: true, email: true } },
                recruiter: { select: { id: true, email: true } },
            }
        );

        return res.status(201).json({ data: interview });
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
