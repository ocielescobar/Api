const db = require('../config/db');

const obtenerTiposEntrega = (callback) => {
  const sql = 'SELECT * FROM tipo_entrega';
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Obtener tipo de entrega por id
const obtenerTipoEntregaPorId = (id, callback) => {
  const sql = 'SELECT * FROM tipo_entrega WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Eliminar tipo de entrega por id
const eliminarTipoEntrega = (id, callback) => {
  const sql = 'DELETE FROM tipo_entrega WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return callback(err);
    if (results.affectedRows === 0) {
      return callback(null, { mensaje: 'Tipo de entrega no encontrado' });
    }
    callback(null, { mensaje: 'Tipo de entrega eliminado con éxito' });
  });
};

// Actualizar tipo de entrega por id
const actualizarTipoEntrega = (id, datosActualizados, callback) => {
  const sql = 'UPDATE tipo_entrega SET nombre = ?, descripcion = ? WHERE id = ?';
  db.query(sql, [datosActualizados.nombre, datosActualizados.descripcion, id], (err, results) => {
    if (err) return callback(err);
    if (results.affectedRows === 0) {
      return callback(null, { mensaje: 'Tipo de entrega no encontrado' });
    }
    callback(null, { mensaje: 'Tipo de entrega actualizado con éxito' });
  });
};

module.exports = {
  obtenerTiposEntrega,
  obtenerTipoEntregaPorId,
  eliminarTipoEntrega,
  actualizarTipoEntrega,
};
