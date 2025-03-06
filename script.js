// Lista de assentos reservados (exemplo, pode ser atualizado com dados reais)
let assentosReservados = [53, 64]; // Assentos já reservados no início

// Função para carregar os assentos disponíveis no menu suspenso
function carregarAssentos() {
    const assentoSelect = document.getElementById('assento');
    
    // Limpar as opções existentes
    assentoSelect.innerHTML = '';

    // Adicionar as opções de assentos ao menu suspenso
    for (let i = 1; i <= 64; i++) {
        if (!assentosReservados.includes(i)) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Assento ${i}`;
            assentoSelect.appendChild(option);
        }
    }
}

// Função para enviar e-mail de confirmação
function enviarEmail(nome, email, assento) {
    const templateParams = {
        nome: nome,
        email: email,
        assento: assento
    };

    emailjs.send('SEU_SERVICE_ID', 'SEU_TEMPLATE_ID', templateParams)
        .then((response) => {
            console.log('E-mail enviado com sucesso:', response.status, response.text);
            alert('Um e-mail com as informações da sua reserva foi enviado!');
        }, (error) => {
            console.error('Erro ao enviar o e-mail:', error);
            alert('Houve um erro ao enviar o e-mail. Tente novamente mais tarde.');
        });
}

// Função para reservar o assento
function reservarAssento() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const escola = document.getElementById('escola').value;
    const assentoSelecionado = document.getElementById('assento').value;
    const email = document.getElementById('email').value;

    // Verificar se o assento já foi reservado
    if (assentosReservados.includes(parseInt(assentoSelecionado))) {
        alert("Este assento já foi reservado. Por favor, escolha outro.");
        return;
    }

    // Adicionar o assento à lista de reservados
    assentosReservados.push(parseInt(assentoSelecionado));

    // Atualizar o menu suspenso para refletir a nova reserva
    carregarAssentos();

    // Exibir a mensagem de confirmação
    document.getElementById('mensagem').textContent = `Assento ${assentoSelecionado} reservado com sucesso!`;

    // Enviar o e-mail de confirmação
    enviarEmail(nome, email, assentoSelecionado);
}

// Carregar os assentos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarAssentos();
});
