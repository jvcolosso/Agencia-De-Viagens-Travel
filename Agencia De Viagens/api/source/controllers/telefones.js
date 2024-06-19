const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE
const create = async (req, res) => {
    const data = req.body;
    try {
        if (!data.id_hotel) {
            return res.status(400).json({ error: "O campo id_hotel é obrigatório." });
        }

        const hotelExists = await prisma.hoteis.findUnique({
            where: { id: data.id_hotel }
        });

        if (!hotelExists) {
            return res.status(404).json({ error: "Hotel não encontrado." });
        }

        const telefone = await prisma.telefones.create({
            data: {
                telefone: data.telefone,
                id_hotel: data.id_hotel
            }
        });

        res.status(201).json(telefone).end();
    } catch (error) {
        console.error("Erro ao criar telefone:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// READ
const read = async (req, res) => {
    try {
        const telefones = await prisma.telefones.findMany();
        res.status(200).json(telefones).end();
    } catch (error) {
        console.error("Erro ao buscar telefones:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// UPDATE
const update = async (req, res) => {
    const data = req.body;
    try {
        const telefone = await prisma.telefones.update({
            where: { id: Number(req.params.id) },
            data: {
                telefone: data.telefone,
                id_hotel: data.id_hotel
            }
        });

        res.status(200).json(telefone).end();
    } catch (error) {
        console.error("Erro ao atualizar telefone:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// DELETE
const del = async (req, res) => {
    try {
        const telefone = await prisma.telefones.delete({
            where: { id: Number(req.params.id) }
        });

        res.status(200).json(telefone).end();
    } catch (error) {
        console.error("Erro ao excluir telefone:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

module.exports = {
    create,
    read,
    update,
    del
};
