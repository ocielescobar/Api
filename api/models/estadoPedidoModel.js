const db = require('../config/db');

// Obtener estado de los pedidos
const obtenerEstadoPedidos = (callback) => {
  const sql = 'SELECT * FROM Estado_Pedido';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Agregar estado pedido
const agregarEstadoPedido = (estado, callback) => {
  const { nombre } = estado;
  const sql = 'INSERT INTO Estado_Pedido (nombre) VALUES (?)';
  db.query(sql, [nombre], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta de inserción:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Actualizar estado pedido
const actualizarEstadoPedido = (id, estado, callback) => {
  const { nombre } = estado;
  const sql = 'UPDATE Estado_Pedido SET nombre = ? WHERE id_estado = ?';
  db.query(sql, [nombre, id], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta de actualización:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Eliminar estado pedido
const eliminarEstadoPedido = (id, callback) => {
  const sql = 'DELETE FROM Estado_Pedido WHERE id_estado = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta de eliminación:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports = {
  obtenerEstadoPedidos,
  agregarEstadoPedido,
  actualizarEstadoPedido,
  eliminarEstadoPedido
};
