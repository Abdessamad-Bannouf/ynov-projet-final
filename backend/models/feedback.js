const prisma = require('../utils/prisma');

class Feedback {
    static async findAll() {
        return prisma.feedback.findMany();
    }

    static async findById(id) {
        return prisma.feedback.findUnique({ where: { id: parseInt(id) } });
    }

    static async create({ interviewId, reviewerId, comments }) {
        return prisma.feedback.create({
            data: {
                interviewId: parseInt(interviewId),
                reviewerId: parseInt(reviewerId),
                comments,
            },
        });
    }

    static async exists(interviewId, reviewerId) {
        return prisma.feedback.findFirst({
            where: {
                interviewId: parseInt(interviewId),
                reviewerId: parseInt(reviewerId),
            },
        });
    }

    static async getByInterview(interviewId, skip, take) {
        return prisma.feedback.findMany({
            where: { interviewId: parseInt(interviewId) },
            include: { reviewer: true },
            skip,
            take,
        });
    }

    static async countByInterview(interviewId) {
        return prisma.feedback.count({
            where: { interviewId: parseInt(interviewId) },
        });
    }

    static async getByReviewer(reviewerId, skip, take) {
        return prisma.feedback.findMany({
            where: { reviewerId: parseInt(reviewerId) },
            include: { interview: true },
            skip,
            take,
        });
    }

    static async countByReviewer(reviewerId) {
        return prisma.feedback.count({
            where: { reviewerId: parseInt(reviewerId) },
        });
    }

    static async update(id, data) {
        return prisma.feedback.update({
            where: { id: parseInt(id) },
            data,
        });
    }

    static async delete(id) {
        return prisma.feedback.delete({ where: { id: parseInt(id) } });
    }

    static async deleteManyByInterviewId(interviewId) {
        return prisma.feedback.deleteMany({
            where: { interviewId: parseInt(interviewId) }
        });
    }
}

module.exports = Feedback;
