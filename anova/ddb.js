const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Altere se necessário
    password: '',      // Coloque sua senha do banco
    database: 'hah_db' // Nome do seu banco de dados
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err.stack);
        return;
    }
    console.log('Conectado ao MySQL com sucesso!');
});

module.exports = connection;