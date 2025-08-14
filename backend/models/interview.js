const prisma = require('../prisma/prisma');

class Interview {
    static async show(id) {
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) throw new Error('Invalid ID');

        return prisma.interview.findUnique({
            where: { id: parsedId },
            include: {
                candidate: true,
                recruiter: true,
                feedbacks: true,
            },
        });
    }

    static async showAll() {
        return prisma.interview.findMany({
            include: {
                candidate: true,
                recruiter: true,
                feedbacks: true,
            },
        });
    }

    static async create(data, include) {
        return prisma.interview.create({ data, include });
    }

    static async update(id, data) {
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) throw new Error('Invalid ID');

        return prisma.interview.update({
            where: { id: parsedId },
            data,
        });
    }

    static async delete(id) {
        const parsedId = parseInt(id);
        if (isNaN(parsedId)) throw new Error('Invalid ID');

        return prisma.interview.delete({
            where: { id: parsedId },
        });
    }
}

module.exports = Interview;
