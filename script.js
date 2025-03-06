const reservas = {}; // Armazenará as reservas  
const assentosReservados = new Set(); // Armazenar assentos já reservados  
const cpfsReservados = new Set(); // Armazenar CPFs já utilizados para reservas  

function carregarAssentos() {  
    const assentoSelect = document.getElementById('assento');  
    assentoSelect.innerHTML = '<option value="">Selecione um Assento</option>'; // Limpa opções no select  

    // Adiciona assentos disponíveis (de 1 a 64)  
    for (let i = 1; i <= 64; i++) {  
        if (!assentosReservados.has(i)) { // Verifica se o assento já está reservado  
            const option = document.createElement('option');  
            option.value = i;  
            option.textContent = `Assento ${i}`;  
            assentoSelect.appendChild(option);  
        }  
    }  
}  

function atualizarPainelControle() {  
    const tabelaReservas = document.getElementById('tabela-reservas').getElementsByTagName('tbody')[0];  
    tabelaReservas.innerHTML = ''; // Limpa a tabela atual  

    // Adiciona cada reserva à tabela  
    for (const assento in reservas) {  
        const reserva = reservas[assento];  
        const row = tabelaReservas.insertRow();  

        // Insere as células  
        const cellNome = row.insertCell(0);  
        const cellEscola = row.insertCell(1);  
        const cellAssento = row.insertCell(2);  

        cellNome.textContent = reserva.nome;  
        cellEscola.textContent = reserva.escola;  
        cellAssento.textContent = assento;  
    }  
}  

function processarReserva(event) {  
    event.preventDefault(); // Impede o envio do formulário padrão  

    const nome = document.getElementById('nome').value.trim();  
    const cpf = document.getElementById('cpf').value.trim();  
    const escola = document.getElementById('escola').value.trim();  
    const assento = document.getElementById('assento').value;  
    const email = document.getElementById('email').value.trim();  
    const errorMessageElement = document.getElementById('error-message');  
    errorMessageElement.textContent = ''; // Limpa mensagens de erro anteriores  

    // Verificação de campos obrigatórios  
    if (!nome || !cpf || !escola || !assento || !email) {  
        errorMessageElement.textContent = 'Por favor, preencha todos os campos.';  
        return;  
    }  

    // Verifica se o assento já está reservado  
    if (assentosReservados.has(parseInt(assento))) {  
        errorMessageElement.textContent = 'Este assento já está reservado. Escolha outro.';  
        return;  
    }  

    // Verifica se o CPF já está reservado  
    if (cpfsReservados.has(cpf)) {  
        errorMessageElement.textContent = 'Este CPF já possui um assento reservado. Não é possível reservar mais de um assento.';  
        return;  
    }  

    // Registrar a reserva e marcar o assento como reservado  
    reservas[assento] = { nome, cpf, escola, email }; // Armazena a reserva  
    assentosReservados.add(parseInt(assento)); // Marca o assento como reservado  
    cpfsReservados.add(cpf); // Marca o CPF como já utilizado  

    // Exibir mensagem de sucesso  
    const messageContainer = document.getElementById('message-container');  
    document.getElementById('message').textContent = `Seu assento é o de número ${assento}`;  
    messageContainer.style.display = 'block';  

    // Atualizar opções de assentos disponíveis  
    carregarAssentos(); // Atualiza os assentos após a reserva  

    // Atualiza o painel de controle  
    atualizarPainelControle();  
}  

// Carregar os assentos e configurar o botão de reserva  
document.addEventListener('DOMContentLoaded', () => {  
    carregarAssentos(); // Chama a função para carregar os assentos na inicialização  
    document.getElementById('reserva-form').addEventListener('submit', processarReserva);  
});  