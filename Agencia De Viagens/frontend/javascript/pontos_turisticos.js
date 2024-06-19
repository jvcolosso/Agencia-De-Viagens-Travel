const uri = "http://localhost:3000/pontos_turisticos";
let itens = [];

function loadItens() {
    fetch(uri)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar Pontos Turisticos');
            }
            return response.json();
        })
        .then(data => {
            itens = data;
            displayData(itens);
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function displayData(itens) {
    const tableBody = document.getElementById('pontos_turisticosTableBody');
    if (!tableBody) {
        console.error('Elemento pontos_turisticosTableBody não encontrado.');
        return;
    }
    tableBody.innerHTML = '';
    itens.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nome || ''}</td>
            <td>${item.endereco || ''}</td>
            <td>${item.telefone || ''}</td>
            <td>${item.valor !== undefined ? item.valor : ''}</td>
            <td>${item.id_destino !== undefined ? item.id_destino : ''}</td>
            <td>
                <button onclick="editarItemForm(${item.id}, '${item.nome}')">Editar</button>
                <button onclick="excluirItem(${item.id})">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function formatarData(data) {
    const dataObj = new Date(data);
    const dia = dataObj.getDate().toString().padStart(2, '0');
    const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function adicionarItemForm() {
    const nome = document.getElementById('nomePontoTuristico').value;
    const endereco = document.getElementById('enderecoPontoTuristico').value;
    const telefone = document.getElementById('telefonePontoTuristico').value;
    const valor = document.getElementById('valorPontoTuristico').value;
    const id_destino = Number(document.getElementById('id_destino').value);
    if (!nome || !endereco || !telefone || !valor || !id_destino) {
        console.error('Por favor, preencha todos os campos.');
        return;
    }
    const novoItem = { nome, endereco, telefone, valor, id_destino };
    fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoItem)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao adicionar item.');
            }
            return response.json();
        })
        .then(responseData => {
            itens.push(responseData);
            displayData(itens);
        })
        .catch(error => {
            console.error('Erro ao adicionar item:', error);
        });
}

document.querySelector('#formPontosTuristicos').addEventListener('submit', (e) => {
    e.preventDefault();
    adicionarItemForm();
});

function editarItemForm(id, nome, endereco, telefone, valor, id_destino) {
    const novoNome = prompt("Digite o novo nome:", nome);
    const novoEndereco = prompt("Digite o novo endereço:", endereco);
    const novoTelefone = prompt("Digite o novo telefone:", telefone);
    const novoValor = prompt("Digite o novo valor:", valor);
    const novoIdDestino = prompt("Digite o novo id_destino:", id_destino);
    
    if (novoNome !== null && novoEndereco !== null && novoTelefone !== null && novoValor !== null && novoIdDestino !== null) {
        const novoItem = { id, nome: novoNome, endereco: novoEndereco, telefone: novoTelefone, valor: parseFloat(novoValor), id_destino: parseInt(novoIdDestino) };
        editarItem(id, novoItem);
    }
}

function editarItem(id, novoItem) {
    fetch(`${uri}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoItem)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText} ao editar o item com ID ${id}`);
            }
            loadItens();
        })
        .catch(error => {
            console.error('Erro ao editar item:', error);
        });
}


function excluirItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText} ao excluir o item com ID ${id}`);
            }
            loadItens();
        })
        .catch(error => {
            console.error('Erro ao excluir item:', error);
        });
}

loadItens();
