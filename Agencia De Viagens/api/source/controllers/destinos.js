const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

//CREATE
const create = async (req, res) => {
    try {
        const { nome, valor, data } = req.body;
        const destino = await prisma.destinos.create({
            data: {
                nome,
                valor,
                data: new Date(data)
            }
        });
        const destinoString = JSON.stringify(destino); 
        res.status(201).send(destinoString);
    } catch (error) {
        console.error("Erro ao criar destino:", error);
        res.status(500).send("Erro ao criar destino");
    }
}


//READ
const read = async (req, res) => {
    const destino = await prisma.destinos.findMany({
        include: {
            hoteis: {
                include: {
                    telefones: true
                }
            },
            pontos: true
        }
    });
    res.status(200).json(destino).end();
}

//UPDATE
const update = async (req, res) => {
    try {
        const data = req.body;
        const id_destino = parseInt(data.id_destino);

        const destinoExists = await prisma.destinos.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });

        if (!destinoExists) {
            return res.status(404).json({ error: "Destino não encontrado" });
        }

        const updateData = {};

        if (data.nome) {
            updateData.nome = data.nome;
        }
        if (data.valor) {
            updateData.valor = data.valor;
        }
        if (data.data) {
            updateData.data = new Date(data.data);
        }

        const destino = await prisma.destinos.update({
            where: {
                id: Number(req.params.id)
            },
            data: updateData
        });

        res.status(200).json(destino);
    } catch (error) {
        console.error("Erro ao atualizar destino:", error);
        res.status(500).send("Erro ao atualizar destino");
    }
};

//DELETE
const del = async (req, res) => {
    const { id } = req.params;
    try {
        const hoteis = await prisma.hoteis.findMany({
            where: {
                id_destino: parseInt(id)
            }
        });

        if (hoteis.length > 0) {
            return res.status(400).json({ error: "Não é possível excluir este destino, pois existem hotéis associados a ele." });
        }

        // Remove o destino
        await prisma.destinos.delete({
            where: {
                id: parseInt(id)
            }
        });

        res.status(200).json({ message: "Destino excluído com sucesso." });
    } catch (error) {
        console.error("Erro ao excluir destino:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
};


module.exports = {
    create,
    read,
    update,
    del,
}