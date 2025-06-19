const db = require('../config/db');
const productoModel = require('../models/productoModel');

// Obtener productos
const obtenerProductos = (req, res) => {
  const sql = 'SELECT id_producto, codigo_producto, nombre, marca, categoria, descripcion, precio, stock, imagen FROM Producto';

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
  const { nombre, precio, stock } = req.body;
  const imagen = req.file ? `/uploads/${req.file.filename}` : null;

  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  const verificarSql = 'SELECT * FROM Producto WHERE LOWER(nombre) = LOWER(?)';
  db.query(verificarSql, [nombre], (err, resultados) => {
    if (resultados.length > 0) {
      return res.status(400).json({ error: 'Ya existe un producto con ese nombre' });
    }

    const codigo = `P${Date.now()}`;
    const insertarSql = `
      INSERT INTO Producto (codigo_producto, nombre, marca, categoria, descripcion, precio, stock, imagen)
      VALUES (?, ?, '', '', '', ?, ?, ?)
    `;

    db.query(insertarSql, [codigo, nombre, precio, stock, imagen], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al agregar el producto' });

      res.status(201).json({ message: 'Producto agregado con éxito', productoId: result.insertId });
    });
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

// Eliminar producto con validación de relación en detalle_pedido
const eliminarProducto = (req, res) => {
  const { id } = req.params;

  // Validar si el producto está siendo referenciado en detalle_pedido
  const verificarRelacion = 'SELECT COUNT(*) AS total FROM detalle_pedido WHERE id_producto = ?';
  db.query(verificarRelacion, [id], (err, resultado) => {
    if (err) {
      console.error('Error al verificar relación:', err);
      return res.status(500).json({ error: 'Error al verificar las relaciones del producto' });
    }

    if (resultado[0].total > 0) {
      return res.status(400).json({ error: 'No se puede eliminar el producto porque está asociado a pedidos anteriores.' });
    }

    // Eliminar primero del inventario si existe
    const eliminarInventario = 'DELETE FROM Inventario WHERE id_producto = ?';
    db.query(eliminarInventario, [id], (err) => {
      if (err) {
        console.error('Error al eliminar del inventario:', err);
        return res.status(500).json({ error: 'Error al eliminar dependencias del producto' });
      }

      const eliminarProducto = 'DELETE FROM Producto WHERE id_producto = ?';
      db.query(eliminarProducto, [id], (err) => {
        if (err) {
          console.error('Error al eliminar el producto:', err);
          return res.status(500).json({ error: 'Error al eliminar el producto' });
        }

        res.status(200).json({ message: 'Producto eliminado con éxito' });
      });
    });
  });
};

// Actualizar producto
const actualizarProducto = (req, res) => {
  const { id } = req.params;
  const { codigo_producto, nombre, marca, categoria, descripcion, precio, stock } = req.body;

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

// Actualizar solo el stock
const actualizarStock = (req, res) => {
  const { id_producto, nuevo_stock } = req.body;

  if (!id_producto || nuevo_stock == null || isNaN(nuevo_stock)) {
    return res.status(400).json({ error: 'Faltan datos válidos para actualizar el stock' });
  }

  const sql = `UPDATE Producto SET stock = ? WHERE id_producto = ?`;

  db.query(sql, [nuevo_stock, id_producto], (err, result) => {
    if (err) {
      console.error('Error al actualizar stock:', err);
      return res.status(500).json({ error: 'Error al actualizar el stock del producto' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Stock actualizado con éxito' });
  });
};

module.exports = {
  obtenerProductos,
  agregarProducto,
  obtenerProductoPorId,
  eliminarProducto,
  actualizarProducto,
  actualizarStock,
};
