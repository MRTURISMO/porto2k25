function reservarAssento() {  
    const nome = document.getElementById('nome').value;  
    const cpf = document.getElementById('cpf').value;  
    const escola = document.getElementById('escola').value;  
    const assento = document.getElementById('assento').value;  

    if (nome && cpf && escola && assento) {  
        alert(`Reserva feita para ${nome}.\nEscola: ${escola}\nAssento: ${assento}`);  
    } else {  
        alert('Por favor, preencha todos os campos.');  
    }  
}  