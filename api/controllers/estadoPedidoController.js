const db = require('../config/db'); // Aquí debes importar tu configuración de base de datos

// Método GET para obtener todos los estados de pedido
exports.getEstadosPedido = (req, res) => {
  const sql = 'SELECT * FROM estado_pedido';
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    
    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(404).json({ message: 'No se encontraron estados de pedidos' });
    }
  });
};

// Método GET para obtener un estado de pedido por id
exports.getEstadoPedidoById = (req, res) => {
  const { id } = req.params;
  
  const sql = 'SELECT * FROM estado_pedido WHERE id_estado = ?';
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    
    if (results.length > 0) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(404).json({ message: 'Estado de pedido no encontrado' });
    }
  });
};

// Método POST para agregar un nuevo estado de pedido
exports.addEstadoPedido = (req, res) => {
  const { nombre } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del estado es obligatorio' });
  }
  
  const sql = 'INSERT INTO estado_pedido (nombre) VALUES (?)';
  
  db.query(sql, [nombre], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al agregar el estado de pedido' });
    }
    
    return res.status(201).json({ message: 'Estado de pedido agregado', id: result.insertId });
  });
};

// Método PUT para actualizar un estado de pedido por id
exports.updateEstadoPedido = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del estado es obligatorio' });
  }
  
  const sql = 'UPDATE estado_pedido SET nombre = ? WHERE id_estado = ?';
  
  db.query(sql, [nombre, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar el estado de pedido' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Estado de pedido no encontrado' });
    }
    
    return res.status(200).json({ message: 'Estado de pedido actualizado' });
  });
};

// Método PATCH para actualizar parcialmente un estado de pedido
exports.updatePartialEstadoPedido = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  
  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del estado es obligatorio' });
  }
  
  const sql = 'UPDATE estado_pedido SET nombre = ? WHERE id_estado = ?';
  
  db.query(sql, [nombre, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar parcialmente el estado de pedido' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Estado de pedido no encontrado' });
    }
    
    return res.status(200).json({ message: 'Estado de pedido actualizado parcialmente' });
  });
};

// Método DELETE para eliminar un estado de pedido por id
exports.deleteEstadoPedido = (req, res) => {
  const { id } = req.params;
  
  const sql = 'DELETE FROM estado_pedido WHERE id_estado = ?';
  
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el estado de pedido' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Estado de pedido no encontrado' });
    }
    
    return res.status(200).json({ message: 'Estado de pedido eliminado' });
  });
};
