// src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Criar a pool de conexões
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'clinica_arco_iris',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// FUNÇÃO QUE ESTÁ A DAR ERRO (Agora exportada corretamente)
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ HEALTH ACCESS HUB - CONECTADO AO MYSQL COM SUCESSO!");
        connection.release();
    } catch (error) {
        console.error("❌ ERRO AO CONECTAR AO BANCO DE DADOS:", error.message);
        process.exit(1); // Para o servidor se não houver banco
    }
}

module.exports = {
    pool,
    testConnection
};