const db = require('../config/db');

// Obtener todos los tipos de entrega
exports.getAllTipoEntrega = (req, res) => {
  const sql = 'SELECT * FROM tipo_entrega';
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener los tipos de entrega' });
    res.status(200).json(results);
  });
};

// Obtener un tipo de entrega por id
exports.getTipoEntregaById = (req, res) => {
  const { id } = req.params;
  
  const sql = 'SELECT * FROM tipo_entrega WHERE id_tipo_entrega = ?';
  
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el tipo de entrega' });
    if (results.length > 0) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(404).json({ message: 'Tipo de entrega no encontrado' });
    }
  });
};

// Crear un nuevo tipo de entrega
exports.createTipoEntrega = (req, res) => {
  const { nombre } = req.body;
  
  const sql = 'INSERT INTO tipo_entrega (nombre) VALUES (?)';
  
  db.query(sql, [nombre], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al crear el tipo de entrega' });
    res.status(201).json({ message: 'Tipo de entrega creado', id: results.insertId });
  });
};

// Actualizar un tipo de entrega (PUT)
exports.updateTipoEntrega = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  const sql = 'UPDATE tipo_entrega SET nombre = ? WHERE id_tipo_entrega = ?';

  db.query(sql, [nombre, id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar el tipo de entrega' });
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Tipo de entrega no encontrado' });
    }
    res.status(200).json({ message: 'Tipo de entrega actualizado' });
  });
};

// Actualizar parcialmente un tipo de entrega (PATCH)
exports.partialUpdateTipoEntrega = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  const sql = 'UPDATE tipo_entrega SET nombre = ? WHERE id_tipo_entrega = ?';

  db.query(sql, [nombre, id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar parcialmente el tipo de entrega' });
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Tipo de entrega no encontrado' });
    }
    res.status(200).json({ message: 'Tipo de entrega actualizado parcialmente' });
  });
};

// Eliminar un tipo de entrega
exports.deleteTipoEntrega = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM tipo_entrega WHERE id_tipo_entrega = ?';

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el tipo de entrega' });
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Tipo de entrega no encontrado' });
    }
    res.status(200).json({ message: 'Tipo de entrega eliminado' });
  });
};
