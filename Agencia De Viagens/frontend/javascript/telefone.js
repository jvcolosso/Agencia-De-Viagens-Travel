const uri = "http://localhost:3000/telefones";
let itens = [];

function loadItens() {
    fetch(uri)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar Telefones');
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

function displayData(data) {
    const tableBody = document.getElementById('telefonesTableBody');
    
    if (!tableBody) {
        console.error('Elemento telefonesTableBody não encontrado.');
        return;
    }
    tableBody.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.telefone}</td>
            <td>${item.id_hotel}</td>
            <td>
                <button onclick="editarItemForm(${item.id}, '${item.telefone}', ${item.id_hotel})">Editar</button>
                <button onclick="excluirItem(${item.id})">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function adicionarNovoTelefone() {
    const telefone = document.getElementById("numeroTelefone").value;
    const id_hotel = document.getElementById("id_hotel").value;

    if (telefone !== "" && id_hotel !== "") {
        const novoItem = { telefone: telefone, id_hotel: parseInt(id_hotel) };
        adicionarItem(novoItem);
    }
}

function adicionarItem(novoItem) {
    fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoItem)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Erro ao adicionar item.');
            });
        }
        loadItens();
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

function editarItemForm(id, telefone, id_hotel) {
    const novoTelefone = prompt("Digite o novo telefone:", telefone);
    const novoIdHotel = prompt("Digite o novo id do hotel:", id_hotel);
    
    if (novoTelefone !== null && novoIdHotel !== null) { 
        const novoItem = { telefone: novoTelefone, id_hotel: parseInt(novoIdHotel) };
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
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Erro ao editar item.');
            });
        }
        loadItens();
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

function excluirItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.error || 'Erro ao excluir item.');
            });
        }
        loadItens();
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

function setupAdicionarTelefoneButton() {
    const adicionarTelefoneBtn = document.getElementById('adicionarTelefoneBtn');
    adicionarTelefoneBtn.addEventListener('click', adicionarNovoTelefone);
}

loadItens();
setupAdicionarTelefoneButton();