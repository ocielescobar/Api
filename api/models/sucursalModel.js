const db = require('../config/db');

// Obtener sucursales
const obtenerSucursales = (callback) => {
  const sql = 'SELECT * FROM Sucursal';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Agregar sucursal
const agregarSucursal = (sucursal, callback) => {
  const { nombre, direccion } = sucursal;
  const sql = 'INSERT INTO Sucursal (nombre, direccion) VALUES (?, ?)';
  db.query(sql, [nombre, direccion], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta de inserción:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Actualizar sucursal
const actualizarSucursal = (id, sucursal, callback) => {
  const { nombre, direccion } = sucursal;
  const sql = 'UPDATE Sucursal SET nombre = ?, direccion = ? WHERE id_sucursal = ?';
  db.query(sql, [nombre, direccion, id], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta de actualización:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Eliminar sucursal
const eliminarSucursal = (id, callback) => {
  const sql = 'DELETE FROM Sucursal WHERE id_sucursal = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta de eliminación:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports = {
  obtenerSucursales,
  agregarSucursal,
  actualizarSucursal,
  eliminarSucursal
};
