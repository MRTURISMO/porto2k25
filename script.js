// Substitua pelos seus dados  
const SHEET_ID = 'SUA_ID_DA_PLANILHA'; // ID da sua planilha  
const CLIENT_ID = 'SUA_CLIENT_ID'; // ID do cliente OAuth  
const API_KEY = 'nRf0FZ02F4h9czGd6'; // Sua Chave da API  
const EMAILJS_USER_ID = 'SUA_EMAILJS_USER_ID'; // User ID do EmailJS  
const TEMPLATE_ID = 'SEU_TEMPLATE_ID'; // Template ID do EmailJS  
const SERVICE_ID = 'SEU_SERVICE_ID'; // Service ID do EmailJS  

// Inicializar o EmailJS  
(function() {  
    emailjs.init(EMAILJS_USER_ID); // Inicializa o EmailJS com seu User ID  
})();  

// Função para enviar um e-mail  
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

// Função para adicionar uma reserva à planilha  
async function adicionarReservaNaPlanilha(nome, cpf, escola, assento) {  
    try {  
        const response = await gapi.client.sheets.spreadsheets.values.append({  
            spreadsheetId: SHEET_ID,  
            range: 'Sheet1!A:D',  
            valueInputOption: 'RAW',  
            resource: {  
                values: [[nome, cpf, escola, assento]]  
            }  
        });  
        console.log("Reserva adicionada à planilha:", response);  
    } catch (error) {  
        console.error("Erro ao adicionar reserva à planilha:", error);  
    }  
}  

// Atualizar a função reservarAssento para incluir o envio de e-mail  
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
        errorMessageElement.textContent = 'Este assento já está reservado. Por favor, escolha outro assento.';  
        return;  
    }  

    // Reservar o assento  
    reservas[cpf] = { nome, escola, assento }; // Armazenar os detalhes da reserva  
    assentosReservados.add(assento); // Marcar o assento como reservado  

    alert(`Reserva feita com sucesso!\nNome: ${nome}\nEscola: ${escola}\nAssento: ${assento}`);  

    // Atualizar a lista de assentos disponíveis  
    atualizarAssentos();  

    // Adicionar reserva à planilha do Google  
    adicionarReservaNaPlanilha(nome, cpf, escola, assento);  

    // Enviar e-mail ao passageiro  
    enviarEmail(nome, email, assento);  
}  

// Carregar o gapi quando a página for carregada  
document.addEventListener('DOMContentLoaded', () => {  
    gapiLoad();  
    atualizarAssentos();  
});  