const db = require('../config/db'); // Asegúrate de tener tu archivo de conexión a la base de datos

// Obtener todos los productos
exports.getProductos = (req, res) => {
  const sql = 'SELECT * FROM Producto';

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });

    if (results.length > 0) {
      return res.status(200).json(results); // Devuelve todos los productos
    } else {
      return res.status(404).json({ message: 'No se encontraron productos' });
    }
  });
};

// Obtener un producto por su ID
exports.getProductoById = (req, res) => {
  const { id } = req.params; // El id viene de la URL

  const sql = 'SELECT * FROM Producto WHERE id_producto = ?';

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });

    if (results.length > 0) {
      return res.status(200).json(results[0]); // Retorna el producto con ese id
    } else {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
  });
};

// Crear un nuevo producto
exports.createProducto = (req, res) => {
  const { codigo_producto, nombre, marca, categoria, descripcion, precio } = req.body;

  // Validar que todos los campos estén presentes
  if (!codigo_producto || !nombre || !marca || !categoria || !descripcion || !precio) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const sql = `
    INSERT INTO Producto (codigo_producto, nombre, marca, categoria, descripcion, precio) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [codigo_producto, nombre, marca, categoria, descripcion, precio], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al insertar el producto' });

    return res.status(201).json({ message: 'Producto creado exitosamente', id_producto: result.insertId });
  });
};

// Actualizar un producto completo
exports.updateProducto = (req, res) => {
  const { id } = req.params;
  const { codigo_producto, nombre, marca, categoria, descripcion, precio } = req.body;

  // Validar que todos los campos estén presentes
  if (!codigo_producto || !nombre || !marca || !categoria || !descripcion || !precio) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  const sql = `
    UPDATE Producto
    SET codigo_producto = ?, nombre = ?, marca = ?, categoria = ?, descripcion = ?, precio = ?
    WHERE id_producto = ?
  `;

  db.query(sql, [codigo_producto, nombre, marca, categoria, descripcion, precio, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar el producto' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    return res.status(200).json({ message: 'Producto actualizado exitosamente' });
  });
};

// Actualizar parcialmente un producto
exports.partialUpdateProducto = (req, res) => {
  const { id } = req.params;
  const camposActualizados = req.body; // Solo los campos que el usuario quiere actualizar

  // Actualizar solo los campos que se proporcionan
  const sql = 'UPDATE Producto SET ? WHERE id_producto = ?';

  db.query(sql, [camposActualizados, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar el producto' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    return res.status(200).json({ message: 'Producto actualizado parcialmente' });
  });
};

// Eliminar un producto
exports.deleteProducto = (req, res) => {
  const { id } = req.params; // El id viene de la URL

  const sql = 'DELETE FROM Producto WHERE id_producto = ?';

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar el producto' });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    return res.status(200).json({ message: 'Producto eliminado exitosamente' });
  });
};
