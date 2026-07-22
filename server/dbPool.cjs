const mysql = require('mysql2');
require('dotenv').config(); // Carga las variables del archivo .env

// Crear la conexión usando un pool (recomendado para mejor rendimiento)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Convertir el pool para usar promesas (async/await)
const promisePool = pool.promise();

// Probar la conexión
async function probarConexion() {
    try {
        const connection = await promisePool.getConnection();
        console.log("¡Conexión exitosa a la base de datos 'adopcion' desde VS Code!");
        connection.release();
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
    }
}

probarConexion();

module.exports = promisePool;
