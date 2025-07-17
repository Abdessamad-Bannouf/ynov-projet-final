const prisma = require('../prisma/prisma');


exports.findById = async(id) => {
    return prisma.interview.findUnique({
        where: { id: parseInt(id) }
    });
}

exports.showAll = async () => {
    return await prisma.interview.findMany({
        include: {
            candidate: true,
            recruiter: true,
            feedbacks: true,
        },
    });
};

exports.create = async (data) => {
    return await prisma.interview.create({ data });
};

exports.update = async (id, data) => {
    return await prisma.interview.update({
        where: { id: parseInt(id) },
        data,
    });
};

exports.delete = async (id) => {
    return await prisma.interview.delete({
        where: { id: parseInt(id) },
    });
};
