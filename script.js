// Substitua pelos seus dados
const SHEET_ID = '1RUNAnSCxG2gwKV6yvKUdJguRUBVEs9vKsG4HOrlrWNM'; // ID da planilha
const CLIENT_ID = '303347582405-3b82rf7ri49400q1ijgkanl5esjriu3n.apps.googleusercontent.com'; // Cliente OAuth
const API_KEY = 'AIzaSyDCwzbEKQlfgph6XqFbszqJYvm1dpzobNU'; // Chave da API
const EMAILJS_USER_ID = 'SEU_EMAILJS_USER_ID'; // User ID do EmailJS
const TEMPLATE_ID = 'SEU_TEMPLATE_ID'; // Template ID do EmailJS
const SERVICE_ID = 'SEU_SERVICE_ID'; // Service ID do EmailJS

// Armazena as reservas e assentos ocupados
const reservas = {};
const assentosReservados = new Set();

// Inicializar EmailJS
(function() {
    emailjs.init(EMAILJS_USER_ID);
})();

// Função para carregar a API do Google
function gapiLoad() {
    gapi.load('client:auth2', iniciarCliente);
}

async function iniciarCliente() {
    await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
        scope: "https://www.googleapis.com/auth/spreadsheets"
    });

    // Forçar login do Google
    const authInstance = gapi.auth2.getAuthInstance();
    const isSignedIn = authInstance.isSignedIn.get();

    if (!isSignedIn) {
        await authInstance.signIn();
    }
}

// Função para adicionar reserva na planilha
async function adicionarReservaNaPlanilha(nome, cpf, escola, assento, email) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Sheet1!A:F'
        });

        let values = response.result.values || [];
        let assentoEncontrado = false;
        let linhaParaAtualizar = -1;

        // Verificar se o assento já está reservado
        for (let i = 0; i < values.length; i++) {
            if (values[i][3] === assento) { // Coluna D = Assento
                assentoEncontrado = true;
                linhaParaAtualizar = i + 1;
                break;
            }
        }

        if (assentoEncontrado) {
            await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: SHEET_ID,
                range: `Sheet1!A${linhaParaAtualizar}:F${linhaParaAtualizar}`,
                valueInputOption: 'RAW',
                resource: {
                    values: [[nome, cpf, escola, assento, new Date().toLocaleString(), email]]
                }
            });
            console.log("Reserva atualizada na planilha:", assento);
        } else {
            await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: SHEET_ID,
                range: 'Sheet1!A:F',
                valueInputOption: 'RAW',
                resource: {
                    values: [[nome, cpf, escola, assento, new Date().toLocaleString(), email]]
                }
            });
            console.log("Nova reserva adicionada à planilha:", assento);
        }
    } catch (error) {
        console.error("Erro ao adicionar/atualizar reserva na planilha:", error);
    }
}

// Função para enviar e-mail de confirmação
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

// Função para reservar assento
function reservarAssento() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const escola = document.getElementById('escola').value;
    const assento = document.getElementById('assento').value;
    const email = document.getElementById('email').value;

    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = ''; // Limpar mensagens de erro anteriores

    // Validação dos inputs
    if (!nome || !cpf || !escola || !assento || !email) {
        errorMessageElement.textContent = 'Por favor, preencha todos os campos.';
        return;
    }

    // Verificar se o CPF já foi utilizado
    if (reservas[cpf]) {
        errorMessageElement.textContent = 'Este CPF já foi utilizado para uma reserva.';
        return;
    }

    // Verificar se o assento já está reservado
    if (assentosReservados.has(assento)) {
        errorMessageElement.textContent = 'Este assento já está reservado. Escolha outro.';
        return;
    }

    // Reservar o assento
    reservas[cpf] = { nome, escola, assento };
    assentosReservados.add(assento);

    alert(`Reserva feita com sucesso!\nNome: ${nome}\nEscola: ${escola}\nAssento: ${assento}`);

    // Adicionar reserva à planilha do Google
    adicionarReservaNaPlanilha(nome, cpf, escola, assento, email);

    // Enviar e-mail ao passageiro
    enviarEmail(nome, email, assento);
}

// Vincular o evento de clicar no botão de reserva
document.addEventListener('DOMContentLoaded', () => {
    gapiLoad();
    document.getElementById('btnReservar').addEventListener('click', reservarAssento); // Vincular o botão "Reservar"
});
