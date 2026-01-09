// server.js - versão mínima que funciona
const express = require('express');
const app = express();
const port = 3000;

// Middleware para JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota raiz
app.get('/', (req, res) => {
    res.send('Servidor Node.js + Express funcionando!');
});

// Rotas de teste
app.get('/teste', (req, res) => {
    res.send('Rota /teste funcionando!');
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
