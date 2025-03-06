// Atomic variables to track reserved seats and registered CPF  
const reservas = {};  
const assentosReservados = new Set();  
const totalAssentos = 64; // Total number of seats  

function atualizarAssentos() {  
    const assentosContainer = document.getElementById('assentos');  
    assentosContainer.innerHTML = ''; // Limpa a lista de assentos  

    for (let i = 1; i <= totalAssentos; i++) {  
        const assentoDiv = document.createElement('div');  
        assentoDiv.classList.add('assento');  
        
        assentoDiv.textContent = i; // Exibe o número do assento  

        if (assentosReservados.has(i.toString())) {  
            assentoDiv.classList.add('reservado'); // Se o assento estiver reservado  
        } else {  
            assentoDiv.classList.add('disponivel'); // Se o assento estiver disponível  
        }  
        
        assentosContainer.appendChild(assentoDiv); // Adiciona o assento ao container  
    }  
}  

function reservarAssento() {  
    const nome = document.getElementById('nome').value;  
    const cpf = document.getElementById('cpf').value;  
    const escola = document.getElementById('escola').value;  
    const assento = document.getElementById('assento').value;  

    const errorMessageElement = document.getElementById('error-message');  
    errorMessageElement.textContent = ''; // Clear previous errors  

    // Validate inputs  
    if (!nome || !cpf || !escola || !assento) {  
        errorMessageElement.textContent = 'Por favor, preencha todos os campos.';  
        return;  
    }  

    // Check if CPF is already used  
    if (reservas[cpf]) {  
        errorMessageElement.textContent = 'Este CPF já foi utilizado para uma reserva.';  
        return;  
    }  

    // Check if the seat is already reserved  
    if (assentosReservados.has(assento)) {  
        errorMessageElement.textContent = 'Este assento já está reservado. Por favor, escolha outro assento.';  
        return;  
    }  

    // Reserve the seat  
    reservas[cpf] = { nome, escola, assento }; // Store reservation details  
    assentosReservados.add(assento); // Mark seat as reserved  
    
    alert(`Reserva feita com sucesso!\nNome: ${nome}\nEscola: ${escola}\nAssento: ${assento}`);  

    // Atualizar a lista de assentos disponíveis  
    atualizarAssentos();  
}  

// Inicializa os assentos ao carregar a página  
document.addEventListener('DOMContentLoaded', atualizarAssentos);  