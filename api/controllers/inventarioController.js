// controllers/inventarioController.js
const db = require('../config/db');

// Obtener todos los inventarios
exports.getInventarios = (req, res) => {
  db.query('SELECT * FROM Inventario', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los inventarios' });
    res.status(200).json(results);
  });
};

// Obtener inventario por ID
exports.getInventarioById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Inventario WHERE id_inventario = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });
    if (results.length === 0) return res.status(404).json({ mensaje: 'Inventario no encontrado' });
    res.status(200).json(results[0]);
  });
};

// Crear nuevo inventario
exports.createInventario = (req, res) => {
  const { id_producto, id_sucursal, stock } = req.body;
  const sql = 'INSERT INTO Inventario (id_producto, id_sucursal, stock) VALUES (?, ?, ?)';
  db.query(sql, [id_producto, id_sucursal, stock], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al crear inventario' });
    res.status(201).json({ mensaje: 'Inventario creado', id_inventario: result.insertId });
  });
};

// Actualizar completamente un inventario (PUT)
exports.updateInventario = (req, res) => {
  const { id } = req.params;
  const { id_producto, id_sucursal, stock } = req.body;
  const sql = 'UPDATE Inventario SET id_producto = ?, id_sucursal = ?, stock = ? WHERE id_inventario = ?';
  db.query(sql, [id_producto, id_sucursal, stock, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar inventario' });
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Inventario no encontrado' });
    res.status(200).json({ mensaje: 'Inventario actualizado' });
  });
};

// Actualización parcial (PATCH)
exports.partialUpdateInventario = (req, res) => {
  const { id } = req.params;
  const campos = req.body;
  db.query('UPDATE Inventario SET ? WHERE id_inventario = ?', [campos, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar parcialmente' });
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Inventario no encontrado' });
    res.status(200).json({ mensaje: 'Inventario actualizado parcialmente' });
  });
};

// Eliminar inventario
exports.deleteInventario = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Inventario WHERE id_inventario = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar inventario' });
    if (result.affectedRows === 0) return res.status(404).json({ mensaje: 'Inventario no encontrado' });
    res.status(200).json({ mensaje: 'Inventario eliminado' });
  });
};
