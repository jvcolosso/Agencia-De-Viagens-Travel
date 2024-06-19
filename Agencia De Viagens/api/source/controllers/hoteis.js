const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE
const create = async (req, res) => {
    try {
        const data = req.body;

        if (!data.id_destino) {
            return res.status(400).json({ error: "O campo id_destino é obrigatório." });
        }

        data.avaliacao = String(data.avaliacao);

        const hotel = await prisma.hoteis.create({
            data: {
                nome: data.nome,
                valor: data.valor,
                avaliacao: data.avaliacao,
                email: data.email,
                site: data.site,
                id_destino: parseInt(data.id_destino)
            }
        });
        res.status(201).json(hotel);
    } catch (error) {
        console.error("Erro ao criar hotel:", error);
        res.status(500).send("Erro ao criar hotel");
    }
};

// READ
const read = async (req, res) => {
    try {
        const hoteis = await prisma.hoteis.findMany({
            include: {
                telefones: true
            }
        });
        res.status(200).json(hoteis);
    } catch (error) {
        console.error("Erro ao buscar hotéis:", error);
        res.status(500).send("Erro ao buscar hotéis");
    }
};

// UPDATE
const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        if (data.id_destino) {
            data.id_destino = parseInt(data.id_destino);
        }

        const existingHotel = await prisma.hoteis.findUnique({
            where: { id: id }
        });

        if (!existingHotel) {
            return res.status(404).json({ error: "Hotel não encontrado" });
        }

        const hotel = await prisma.hoteis.update({
            where: { id: id },
            data: data
        });
        res.status(200).json(hotel);
    } catch (error) {
        console.error("Erro ao atualizar hotel:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

// DELETE
const del = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const existingHotel = await prisma.hoteis.findUnique({
            where: { id: id }
        });

        if (!existingHotel) {
            return res.status(404).json({ error: "Hotel não encontrado" });
        }

        const telefones = await prisma.telefones.findMany({
            where: { id_hotel: id }
        });

        if (telefones.length > 0) {
            return res.status(400).json({ error: "Não é possível excluir este hotel, pois existem telefones associados a ele." });
        }

        await prisma.hoteis.delete({
            where: { id: id }
        });

        res.status(200).json({ message: "Hotel excluído com sucesso." });
    } catch (error) {
        console.error("Erro ao excluir hotel:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};

module.exports = {
    create,
    read,
    update,
    del
};