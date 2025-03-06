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

// Função para reservar o assento
function reservarAssento() {
    const assentoSelecionado = document.getElementById('assento').value;
    
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

    // Aqui você pode adicionar a lógica para enviar e-mail ou atualizar a planilha
}

// Carregar os assentos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarAssentos();
});
