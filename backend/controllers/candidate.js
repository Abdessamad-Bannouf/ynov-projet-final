const candidate = require('../models/candidate');

exports.create = async(req, res) => {
    try {
        const {name, email, phone, skills, experience} = req.body;
        const cvUrl = req.file ? req.file.path : null;

        const createCandidate = await candidate.create({
            "name": name,
            "email": email,
            "phone": phone,
            "cvUrl": cvUrl,
            "skills": skills,
            "experience": parseInt(experience),

        });

        res.status(201).json(createCandidate);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Erreur lors de la création du candidat.'});
    }
};

exports.showAll = async (req, res) => {
    try {
        // Appel du middleware pour récupérer les valeurs.
        const { page, pageSize, skip } = req.pagination;

        const [candidates, total] = await Promise.all([
             candidate.showAll({
                skip,
                take: pageSize,
            }),
            candidate.count(),
        ]);

        res.status(200).json({
            data: candidates,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des candidats.' });
    }
};

exports.show = async(req, res) => {
    try {
        const { id } = req.params;
        const singleCandidate  = await candidate.findById(id);

        if(!singleCandidate) {
            return res.status(404).json({ error: 'Candidat non trouvé'});
        }

        res.status(200).json(singleCandidate);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Erreur lors de la récupération du candidat.'});
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, skills, experience } = req.body;
        const cvUrl = req.file ? req.file.path : null;

        const updatedCandidate = await candidate.update(parseInt(id), {
            "name": name,
            'email': email,
            "phone": phone,
            "cvUrl": cvUrl,
            "skills": skills,
            "experience": parseInt(experience)
        });

        res.status(200).json(updatedCandidate);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du candidat.'});
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        await candidate.deleteManyInterviewsByCandidateId(id);

        await candidate.delete(id);

        res.status(200).json({ message: 'Candidat supprimé avec succès.' })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du candidat.' })
    }
};