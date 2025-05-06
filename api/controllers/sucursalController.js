const db = require('../config/db');

// Obtener todas las sucursales
exports.getAll = (req, res) => {
  db.query('SELECT * FROM sucursal', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener sucursales' });
    res.status(200).json(results);
  });
};

// Obtener una sucursal por ID
exports.getById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM sucursal WHERE id_sucursal = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener la sucursal' });
    if (results.length === 0) return res.status(404).json({ message: 'Sucursal no encontrada' });
    res.status(200).json(results[0]);
  });
};

// Crear una nueva sucursal
exports.create = (req, res) => {
  const { id_sucursal, nombre, direccion } = req.body;
  db.query('INSERT INTO sucursal (id_sucursal, nombre, direccion) VALUES (?, ?, ?)',
    [id_sucursal, nombre, direccion],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al crear la sucursal' });
      res.status(201).json({ message: 'Sucursal creada exitosamente' });
    });
};

// Actualizar completamente una sucursal (PUT)
exports.update = (req, res) => {
  const { id } = req.params;
  const { nombre, direccion } = req.body;

  db.query('UPDATE sucursal SET nombre = ?, direccion = ? WHERE id_sucursal = ?',
    [nombre, direccion, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar la sucursal' });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Sucursal no encontrada' });
      res.status(200).json({ message: 'Sucursal actualizada exitosamente' });
    });
};

// Actualización parcial de una sucursal (PATCH)
exports.patch = (req, res) => {
  const { id } = req.params;
  const camposActualizados = req.body;

  db.query('UPDATE sucursal SET ? WHERE id_sucursal = ?', [camposActualizados, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error en actualización parcial' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Sucursal no encontrada' });
    res.status(200).json({ message: 'Sucursal actualizada parcialmente' });
  });
};

// Eliminar una sucursal
exports.delete = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM sucursal WHERE id_sucursal = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar la sucursal' });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Sucursal no encontrada' });
    res.status(200).json({ message: 'Sucursal eliminada exitosamente' });
  });
};
