const prisma = require('../prisma/prisma');

class Candidate {
    static async count() {
        return prisma.candidate.count();
    }

    static async showAll() {
        return prisma.candidate.findMany();
    }

    static async findById(id) {
        return prisma.candidate.findUnique({ where: { id: parseInt(id) } });
    }

    static async create(data) {
        return prisma.candidate.create({ data });
    }

    static async update(id, data) {
        return prisma.candidate.update({
            where: { id: parseInt(id) },
            data,
        });
    }

    static async delete(id) {
        return prisma.candidate.delete({ where: { id: parseInt(id) } });
    }

    static async deleteManyInterviewsByCandidateId(candidateId) {
        return prisma.interview.deleteMany({
            where: { candidateId: parseInt(candidateId) },
        });
    }
}

module.exports = Candidate;