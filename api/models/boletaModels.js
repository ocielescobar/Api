const db = require('../config/db');

// Obtener boleta y sus productos
const obtenerBoletaPorId = (id_boleta, callback) => {
  const sqlBoleta = 'SELECT * FROM Boleta WHERE id_boleta = ?';
  const sqlDetalles = `
    SELECT bp.id_producto, p.nombre, bp.cantidad, bp.precio_unitario, (bp.cantidad * bp.precio_unitario) AS total
    FROM BoletaProducto bp
    JOIN Producto p ON bp.id_producto = p.id_producto
    WHERE bp.id_boleta = ?
  `;

  db.query(sqlBoleta, [id_boleta], (err, boletaResult) => {
    if (err || boletaResult.length === 0) return callback(err || new Error('Boleta no encontrada'));

    db.query(sqlDetalles, [id_boleta], (err2, detalles) => {
      if (err2) return callback(err2);

      const boleta = boletaResult[0];
      boleta.detalles = detalles;
      callback(null, boleta);
    });
  });
};

module.exports = { obtenerBoletaPorId };
