// Dados para integração com o Google Sheets e EmailJS
const SHEET_ID = '1RUNAnSCxG2gwKV6yvKUdJguRUBVEs9vKsG4HOrlrWNM'; // ID da planilha
const CLIENT_ID = 'SEU_CLIENT_ID'; // Substitua pelo seu Client ID
const API_KEY = 'SEU_API_KEY'; // Substitua pela sua API Key
const EMAILJS_USER_ID = 'SEU_EMAILJS_USER_ID'; // User ID do EmailJS
const TEMPLATE_ID = 'SEU_TEMPLATE_ID'; // Template ID do EmailJS
const SERVICE_ID = 'SEU_SERVICE_ID'; // Service ID do EmailJS

// Variáveis para armazenar assentos e reservas
const assentosReservados = new Set();  // Assentos que já estão reservados
const reservas = {};  // Objeto para armazenar as reservas

// Inicializa EmailJS
emailjs.init(EMAILJS_USER_ID);

// Função para carregar os assentos disponíveis no menu suspenso
function carregarAssentos() {
    const assentoSelect = document.getElementById('assento');
    
    // Adiciona os assentos ao menu suspenso
    for (let i = 1; i <= 64; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `Assento ${i}`;
        assentoSelect.appendChild(option);
    }
}

// Função para enviar e-mail
function enviarEmail(nome, email, assento) {
    const templateParams = {
        nome: nome,
        email: email,
        assento: assento
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then((response) => {
            console.log('E-mail enviado com sucesso:', response.status, response.text);
        }, (error) => {
            console.error('Erro ao enviar o e-mail:', error);
            alert('Houve um erro ao enviar o e-mail. Tente novamente mais tarde.');
        });
}

// Função para adicionar a reserva à planilha do Google
async function adicionarReservaNaPlanilha(nome, cpf, escola, assento, email) {
    try {
        await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Sheet1!A:F',
            valueInputOption: 'RAW',
            resource: {
                values: [[nome, cpf, escola, assento, new Date().toLocaleString(), email]]
            }
        });
        console.log("Reserva adicionada à planilha:", assento);
    } catch (error) {
        console.error("Erro ao adicionar reserva na planilha:", error);
    }
}

// Função para atualizar o painel de controle (na página)
function atualizarPainel(nome, cpf, escola, assento) {
    const tableBody = document.querySelector('#panel-table tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${nome}</td>
        <td>${cpf}</td>
        <td>${escola}</td>
        <td>${assento}</td>
        <td>${new Date().toLocaleString()}</td>
    `;
    tableBody.appendChild(row);
}

// Função para processar a reserva
function processarReserva() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const escola = document.getElementById('escola').value;
    const assento = document.getElementById('assento').value;
    const email = document.getElementById('email').value;
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = ''; // Limpar mensagens de erro anteriores

    if (!nome || !cpf || !escola || !assento || !email) {
        errorMessageElement.textContent = 'Por favor, preencha todos os campos.';
        return;
    }

    if (reservas[cpf]) {
        errorMessageElement.textContent = 'Este CPF já foi utilizado para uma reserva.';
        return;
    }

    if (assentosReservados.has(assento)) {
        errorMessageElement.textContent = 'Este assento já está reservado. Escolha outro.';
        return;
    }

    reservas[cpf] = { nome, escola, assento };
    assentosReservados.add(assento);

    // Exibir mensagem de sucesso
    const messageContainer = document.getElementById('message-container');
    document.getElementById('message').textContent = `Seu assento é o de número ${assento}`;
    messageContainer.style.display = 'block';

    // Adicionar à planilha e painel administrativo
    adicionarReservaNaPlanilha(nome, cpf, escola, assento, email);
    atualizarPainel(nome, cpf, escola, assento);

    // Enviar o e-mail de confirmação
    enviarEmail(nome, email, assento);
}

// Carregar os assentos e configurar o botão de reserva
document.addEventListener('DOMContentLoaded', () => {
    carregarAssentos();
    document.getElementById('btnReservar').addEventListener('click', processarReserva);
});
