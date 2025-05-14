const db = require('../config/db');

// Obtener inventarios
const obtenerInventarios = (callback) => {
  const sql = 'SELECT * FROM Inventario';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Agregar inventario
const agregarInventario = (inventario, callback) => {
  const { id_producto, id_sucursal, stock } = inventario;
  const sql = 'INSERT INTO Inventario (id_producto, id_sucursal, stock) VALUES (?, ?, ?)';
  db.query(sql, [id_producto, id_sucursal, stock], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta de inserción:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Actualizar  inventario
const actualizarInventario = (id, inventario, callback) => {
  const { stock } = inventario;
  const sql = 'UPDATE Inventario SET stock = ? WHERE id_inventario = ?';
  db.query(sql, [stock, id], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta de actualización:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Eliminar inventario
const eliminarInventario = (id, callback) => {
  const sql = 'DELETE FROM Inventario WHERE id_inventario = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta de eliminación:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports = {
  obtenerInventarios,
  agregarInventario,
  actualizarInventario,
  eliminarInventario
};
