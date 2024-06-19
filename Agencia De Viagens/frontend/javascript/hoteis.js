const uri = "http://localhost:3000/hoteis";
let hoteis = [];

function loadItens() {
    fetch(uri)
        .then(response => response.json())
        .then(data => {
            hoteis.length = 0;
            hoteis.push(...data);
            console.log(hoteis);
            displayData('hoteis', hoteis);
        })
        .catch(error => {
            console.error('Erro ao carregar hotéis:', error);
        });
}

function displayData(hoteis, data) {
    const tableBody = document.getElementById(`${hoteis}TableBody`);
    if (!tableBody) {
        const errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "block";
        console.error(`Elemento ${hoteis}TableBody não encontrado.`);
        return;
    }
    tableBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nome}</td>
            <td>${item.valor}</td>
            <td>${item.avaliacao}</td>
            <td>${item.email}</td>
            <td>${item.site}</td>
            <td>${item.id_destino}</td>
            <td>
                <button onclick="editarItemForm('${hoteis}', ${item.id}, '${item.nome}', '${item.valor}', '${item.avaliacao}', '${item.email}', '${item.site}', '${item.id_destino}')">Editar</button>
                <button onclick="excluirItem(${item.id})">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function adicionarHotelForm() {
    const nome = document.getElementById("nomeHotel").value;
    const valor = document.getElementById("valorHotel").value;
    const avaliacaoInput = document.getElementById("AvaliacaoHotel").value;
    const avaliacao = parseFloat(avaliacaoInput);

    const email = document.getElementById("emailHotel").value;
    const site = document.getElementById("siteHotel").value;
    const id_destino = document.getElementById("id_destino").value;

    const novoHotel = { nome, valor, avaliacao, email, site, id_destino };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoHotel)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar hotel.');
            }
            return response.json();
        })
        .then(responseData => {         
            hoteis.push(responseData);
            displayData('hoteis', hoteis);
        })
        .catch(error => {
            console.error('Erro ao adicionar hotel:', error);
        });
}

function editarItemForm(hoteis, id, nome, valor, avaliacao, email, site, id_destino) {
    const novoNome = prompt("Digite o novo nome:", nome);
    const novoValor = prompt("Digite o novo valor:", valor);
    const novaAvaliacao = prompt("Digite a nova avaliação:", avaliacao);
    const novoEmail = prompt("Digite o novo email:", email);
    const novoSite = prompt("Digite o novo site:", site);
    const novoIdDestino = prompt("Digite o novo ID do destino:", id_destino); // Adicionado o prompt para o novo ID do destino
    if (
        novoNome !== null &&
        novoValor !== null &&
        novaAvaliacao !== null &&
        novoEmail !== null &&
        novoSite !== null &&
        novoIdDestino !== null
    ) {
        const novoItem = { nome: novoNome, valor: novoValor, avaliacao: novaAvaliacao, email: novoEmail, site: novoSite, id_destino: novoIdDestino }; // Adicionado o novo ID do destino
        editarItem(hoteis, id, novoItem);
    }
}


function editarItem(hoteis, id, novoItem) {
    fetch(`${uri}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoItem)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText} ao editar o hotel com ID ${id}`);
            }
            loadItens();
        })
        .catch(error => {
            console.error('Erro ao editar hotel:', error);
        });
}

function excluirItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText} ao excluir o hotel com ID ${id}`);
            }
            loadItens();
        })
        .catch(error => {
            console.error('Erro ao excluir hotel:', error);
        });
}

document.getElementById('formHoteis').addEventListener('submit', function(event) {
    event.preventDefault();
    adicionarHotelForm('hoteis');
});

loadItens();
