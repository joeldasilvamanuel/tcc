const mysql = require('mysql2');
require('dotenv').config();

// =========================
// POOL DE CONEXÕES
// =========================
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// =========================
// PROMISE POOL
// =========================
const promisePool = pool.promise();

// =========================
// TESTAR CONEXÃO
// =========================
async function testConnection() {
    try {

        const connection = await promisePool.getConnection();

        console.log("Conexão com MySQL estabelecida!");
        console.log(`Base de dados "${process.env.DB_NAME}" selecionada.`);

        connection.release();

    } catch (error) {

        console.error("Erro ao conectar na base de dados:", error);

    }
}

module.exports = {
    connection: pool,
    promisePool,
    testConnection
};