import mysql from 'mysql2';

// Banco de dados

const connection = mysql.createConnection({
    host : '172.18.0.3',
    user : 'root',
    password : 'shopperdb',
    database : 'shopper'
});

export default connection;