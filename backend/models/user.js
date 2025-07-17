const prisma = require('../prisma/prisma');

class User {
    static async findAll() {
        return prisma.user.findMany();
    }

    static async findById(id) {
        return prisma.user.findUnique({ where: { id: parseInt(id) } });
    }

    static async findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }

    static async findEmailAndPassword(email, password) {
        return prisma.user.findFirst({
            where: {
                AND: [
                    { email: email },
                    { password: password }
                ]
            }
        });
    }

    static async create(data) {
        return prisma.user.create({ data });
    }

    static async update(id, data) {
        return prisma.user.update({
            where: { id: parseInt(id) },
            data,
        });
    }

    static async delete(id) {
        return prisma.user.delete({ where: { id: parseInt(id) } });
    }
}

module.exports = User;