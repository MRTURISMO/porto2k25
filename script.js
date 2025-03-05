<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reserva de Assentos</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; }
        img { width: 80%; max-width: 600px; margin-top: 20px; }
        select, input, button { display: block; margin: 10px auto; padding: 10px; }
    </style>
</head>
<body>
    <h1>Escolha seu Assento</h1>
    <img id="bus-map" src="" alt="Mapa do Ônibus">
    
    <label>Nome Completo:</label>
    <input type="text" id="nome" required>
    
    <label>CPF:</label>
    <input type="text" id="cpf" required>
    
    <label>Escola:</label>
    <select id="escola">
        <option value="CEMI - GAMA">CEMI - GAMA</option>
        <option value="CED 03 - GUARÁ">CED 03 - GUARÁ</option>
        <option value="GG - GUARÁ">GG - GUARÁ</option>
        <option value="CEMEIT">CEMEIT</option>
        <option value="CEM URSO BRANCO">CEM URSO BRANCO</option>
    </select>
    
    <label>Assento:</label>
    <input type="number" id="assento" min="1" max="64" required>
    
    <button onclick="reservarAssento()">Reservar</button>
    
    <script src="script.js"></script>
</body>
</html>
