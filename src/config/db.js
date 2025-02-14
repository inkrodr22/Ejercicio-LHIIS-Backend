require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4'

});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
    connection.release();
});

setInterval(() => {
    pool.query('SELECT 1', (err) => {
        if (err) {
            console.error('Error en keep-alive query:', err);
        } else {
            console.log('Keep-alive query ejecutada.');
        }
    });
}, 3600000);


module.exports = pool;
