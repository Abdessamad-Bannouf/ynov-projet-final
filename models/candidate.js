const prisma = require('../util/prisma');

class Candidate {
    static async findAll() {
        return prisma.candidate.findMany();
    }

    static async findById(id) {
        return prisma.candidate.findUnique({ where: { id: parseInt(id) } });
    }

    static async findByEmail(email) {
        return prisma.candidate.findUnique({ where: { email } });
    }

    static async findEmailAndPassword(email, password) {
        return prisma.candidate.findFirst({
            where: {
                AND: [
                    { email: email },
                    { password: password }
                ]
            }
        });
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