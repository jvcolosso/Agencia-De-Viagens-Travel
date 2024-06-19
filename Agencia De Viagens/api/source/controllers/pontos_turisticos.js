const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE
const create = async (req, res) => {
    const data = req.body;
    const pontos = await prisma.pontos_turisticos.create({
        data
    });

    res.status(201).json(pontos).end();
};

// READ
const read = async (req, res) => {
    const pontos = await prisma.pontos_turisticos.findMany();
    
    res.status(200).json(pontos).end();
}

// UPDATE
const update = async (req, res) => {
    const data = req.body
    const pontos = await prisma.pontos_turisticos.update({
        where: { id: Number(req.params.id) }, data
    });

    res.status(200).json(pontos).end();
};

// DELETE
const del = async (req, res) => {
    const pontos = await prisma.pontos_turisticos.delete({
        where: { id: Number(req.params.id) }
    });

    res.status(200).json(pontos).end();
};

module.exports = {
    create,
    read,
    update,
    del
};