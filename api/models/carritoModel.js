const db = require('../config/db');

// Obtener carrito de un usuario
const obtenerCarrito = (id_usuario, callback) => {
  const sql = 'SELECT p.*, c.cantidad FROM Carrito c INNER JOIN Producto p ON c.id_producto = p.id_producto WHERE c.id_usuario = ?';
  db.query(sql, [id_usuario], (err, results) => {
    if (err) {
      console.error('Error al obtener el carrito:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Agregar producto al carrito
const agregarAlCarrito = (id_usuario, id_producto, cantidad, callback) => {
  const sql = 'INSERT INTO Carrito (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)';
  db.query(sql, [id_usuario, id_producto, cantidad], (err, results) => {
    if (err) {
      console.error('Error al agregar producto al carrito:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Actualizar producto en el carrito
const actualizarCantidad = (id_usuario, id_producto, cantidad, callback) => {
  const sql = 'UPDATE Carrito SET cantidad = ? WHERE id_usuario = ? AND id_producto = ?';
  db.query(sql, [cantidad, id_usuario, id_producto], (err, results) => {
    if (err) {
      console.error('Error al actualizar cantidad en el carrito:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Eliminar producto del carrito
const eliminarDelCarrito = (id_usuario, id_producto, callback) => {
  const sql = 'DELETE FROM Carrito WHERE id_usuario = ? AND id_producto = ?';
  db.query(sql, [id_usuario, id_producto], (err, results) => {
    if (err) {
      console.error('Error al eliminar producto del carrito:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports = {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidad,
  eliminarDelCarrito
};
