const mysql = require('mysql2');

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',
  user: 'administrador',
  password: 'yR!9uL2@pX',
  database: 'tienda_db'
});

// Para verificar la conexión
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error de conexión: ', err.stack);
    return;
  }
  console.log('Conexión exitosa a la base de datos');
  connection.release(); // Liberar la conexion despues de usarla
});

module.exports = pool;
