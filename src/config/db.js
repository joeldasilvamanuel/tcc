// src/config/db.js
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinica_arco_iris'
});

const testConnection = () => {
    return new Promise((resolve, reject) => {
        connection.connect((err) => {
            if (err) {
                console.error('❌ Erro ao conectar ao MySQL:', err.message);
                reject(err);
            } else {
                console.log('✅ Conexão com MySQL estabelecida!');
                // Verifica se a DB existe
                connection.query(`USE ${process.env.DB_NAME || 'tcc'}`, (err) => {
                    if (err) {
                        console.error('❌ Base de dados não encontrada!');
                        reject(err);
                    } else {
                        console.log(`📡 Base de dados "${process.env.DB_NAME || 'tcc'}" selecionada.`);
                        resolve();
                    }
                });
            }
        });
    });
};

module.exports = { connection, testConnection };