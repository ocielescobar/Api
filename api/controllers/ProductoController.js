const db = require('../config/db');
const productoModel = require('../models/productoModel');

// Obtener productos (incluye campo stock)
const obtenerProductos = (req, res) => {
  const sql = 'SELECT id_producto, codigo_producto, nombre, marca, categoria, descripcion, precio, stock FROM Producto';

  db.query(sql, (err, productos) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).json({ error: 'Error al obtener los productos' });
    }
    res.json(productos);
  });
};

// Agregar producto
const agregarProducto = (req, res) => {
  const { codigo_producto, nombre, marca, categoria, descripcion, precio, stock } = req.body;

  // Validar datos obligatorios
  if (!codigo_producto || !nombre || !marca || !categoria || !descripcion || !precio || stock == null) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  const sql = `
    INSERT INTO Producto (codigo_producto, nombre, marca, categoria, descripcion, precio, stock)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [codigo_producto, nombre, marca, categoria, descripcion, precio, stock], (err, result) => {
    if (err) {
      console.error('Error al agregar el producto:', err);
      return res.status(500).json({ error: 'Error al agregar el producto' });
    }
    res.status(201).json({ message: 'Producto agregado con éxito', productoId: result.insertId });
  });
};

// Obtener producto por ID
const obtenerProductoPorId = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Producto WHERE id_producto = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al obtener producto:', err);
      return res.status(500).json({ error: 'Error al obtener el producto' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(result[0]);
  });
};

// Eliminar producto por ID
const eliminarProducto = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM Producto WHERE id_producto = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el producto:', err);
      return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
    res.status(200).json({ message: 'Producto eliminado con éxito' });
  });
};

// Actualizar producto por ID
const actualizarProducto = (req, res) => {
  const { id } = req.params;
  const { codigo_producto, nombre, marca, categoria, descripcion, precio, stock } = req.body;

  // Verificar que haya al menos un campo
  if (!codigo_producto && !nombre && !marca && !categoria && !descripcion && !precio && stock == null) {
    return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
  }

  const campos = [];
  const valores = [];

  if (codigo_producto) {
    campos.push('codigo_producto = ?');
    valores.push(codigo_producto);
  }
  if (nombre) {
    campos.push('nombre = ?');
    valores.push(nombre);
  }
  if (marca) {
    campos.push('marca = ?');
    valores.push(marca);
  }
  if (categoria) {
    campos.push('categoria = ?');
    valores.push(categoria);
  }
  if (descripcion) {
    campos.push('descripcion = ?');
    valores.push(descripcion);
  }
  if (precio) {
    campos.push('precio = ?');
    valores.push(precio);
  }
  if (stock != null) {
    campos.push('stock = ?');
    valores.push(stock);
  }

  valores.push(id);

  const sql = `UPDATE Producto SET ${campos.join(', ')} WHERE id_producto = ?`;

  db.query(sql, valores, (err, result) => {
    if (err) {
      console.error('Error al actualizar el producto:', err);
      return res.status(500).json({ error: 'Error al actualizar el producto' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ message: 'Producto actualizado con éxito' });
  });
};

module.exports = {
  obtenerProductos,
  agregarProducto,
  obtenerProductoPorId,
  eliminarProducto,
  actualizarProducto
};
