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

// Função para carregar os assentos
function carregarAssentos() {
    const parteSuperior = document.getElementById('parte-superior');
    const parteInferior = document.getElementById('parte-inferior');

    // Criar assentos para a parte superior (01 a 52)
    for (let i = 1; i <= 52; i++) {
        const assento = document.createElement('div');
        assento.classList.add('assento', 'assento-disponivel');
        assento.innerText = i;
        assento.id = `assento${i}`;
        assento.addEventListener('click', () => selecionarAssento(i));
        parteSuperior.appendChild(assento);
    }

    // Criar assentos para a parte inferior (53 a 64)
    for (let i = 53; i <= 64; i++) {
        const assento = document.createElement('div');
        assento.classList.add('assento', 'assento-disponivel');
        assento.innerText = i;
        assento.id = `assento${i}`;
        assento.addEventListener('click', () => selecionarAssento(i));
        parteInferior.appendChild(assento);
    }
}

// Função para selecionar o assento
function selecionarAssento(assentoId) {
    const assento = document.getElementById(`assento${assentoId}`);
    if (assento.classList.contains('assento-reservado')) {
        alert('Este assento já está reservado.');
        return;
    }

    // Marcar o assento como selecionado
    assento.classList.add('assento-selecionado');
    assento.classList.remove('assento-disponivel');
    document.getElementById('assento').value = assentoId; // Preenche o campo com o número do assento
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
            alert('Um e-mail com as informações da sua reserva foi enviado!');
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

    // Marcar o assento como reservado
    const assentoElement = document.getElementById(`assento${assento}`);
    assentoElement.classList.add('assento-reservado');
    assentoElement.classList.remove('assento-selecionado');

    // Registrar a reserva
    reservas[cpf] = { nome, escola, assento };
    assentosReservados.add(assento);

    alert(`Reserva feita com sucesso!\nNome: ${nome}\nEscola: ${escola}\nAssento: ${assento}`);

    // Adicionar reserva à planilha
    adicionarReservaNaPlanilha(nome, cpf, escola, assento, email);

    // Enviar e-mail
    enviarEmail(nome, email, assento);
}

// Função de inicialização
document.addEventListener('DOMContentLoaded', () => {
    gapiLoad();
    carregarAssentos();
    document.getElementById('btnReservar').addEventListener('click', processarReserva);
});
