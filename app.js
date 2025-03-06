const reservas = {}; // Armazenará as reservas atuais  
const assentosReservados = new Set(); // Armazenar os assentos já reservados  

function carregarAssentos() {  
    const assentoSelect = document.getElementById('assento');  
    assentoSelect.innerHTML = '<option value="">Selecione um Assento</option>'; // Limpa opções no select  

    // Adiciona assentos disponíveis (de 1 a 64)  
    for (let i = 1; i <= 64; i++) {  
        const option = document.createElement('option');  
        option.value = i;  
        option.textContent = `Assento ${i}`;  
        // Verifica se o assento já está reservado  
        if (!assentosReservados.has(i)) {  
            assentoSelect.appendChild(option);  
        }  
    }  
}  

function processarReserva(event) {  
    event.preventDefault(); // Impede o envio do formulário padrão  

    const nome = document.getElementById('nome').value.trim();  
    const cpf = document.getElementById('cpf').value.trim(); // Captura o CPF  
    const escola = document.getElementById('escola').value.trim(); // Captura a escola  
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
    if (assentosReservados.has(assento)) {  
        errorMessageElement.textContent = 'Este assento já está reservado. Escolha outro.';  
        return;  
    }  

    // Registrar a reserva e marcar o assento como reservado  
    reservas[assento] = { nome, cpf, escola, email }; // Armazena o CPF e outras informações  
    assentosReservados.add(assento); // Marca o assento como reservado  

    // Exibir mensagem de sucesso  
    const messageContainer = document.getElementById('message-container');  
    document.getElementById('message').textContent = `Seu assento é o de número ${assento}`;  
    messageContainer.style.display = 'block';  

    // Atualizar opções de assentos disponíveis  
    carregarAssentos(); // Atualiza os assentos após a reserva  
}  

// Carregar os assentos e configurar o botão de reserva  
document.addEventListener('DOMContentLoaded', () => {  
    carregarAssentos(); // Chama a função para carregar os assentos na inicialização  
    document.getElementById('reserva-form').addEventListener('submit', processarReserva);  
});  