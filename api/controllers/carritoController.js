const carritoModel = require('../models/carritoModel');
const db = require('../config/db');

// Obtener el carrito de un usuario
const obtenerCarrito = (req, res) => {
  const { id_usuario } = req.params;

  carritoModel.obtenerCarrito(id_usuario, (err, carrito) => {
    if (err) {
      console.error('Error al obtener el carrito:', err);
      return res.status(500).json({ error: 'Error al obtener el carrito' });
    }
    res.json(carrito);
  });
};

// Agregar un producto al carrito (sin descontar stock)
const agregarAlCarrito = (req, res) => {
  const { id_usuario, id_producto, cantidad = 1 } = req.body;

  if (!id_usuario || !id_producto) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  // Verificar si ya existe el producto en el carrito
  const checkSql = `
    SELECT cantidad FROM Carrito WHERE id_usuario = ? AND id_producto = ?
  `;

  db.query(checkSql, [id_usuario, id_producto], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });

    if (results.length > 0) {
      // Ya existe → actualizamos la cantidad
      const nuevaCantidad = results[0].cantidad + cantidad;
      const updateSql = `
        UPDATE Carrito SET cantidad = ? WHERE id_usuario = ? AND id_producto = ?
      `;
      db.query(updateSql, [nuevaCantidad, id_usuario, id_producto], (err2) => {
        if (err2) return res.status(500).json({ error: 'Error al actualizar cantidad' });
        return res.status(200).json({ message: 'Cantidad actualizada en el carrito' });
      });

    } else {
      // No existe → insertamos nuevo
      const insertSql = `
        INSERT INTO Carrito (id_usuario, id_producto, cantidad)
        VALUES (?, ?, ?)
      `;
      db.query(insertSql, [id_usuario, id_producto, cantidad], (err3) => {
        if (err3) return res.status(500).json({ error: 'Error al agregar al carrito' });
        return res.status(200).json({ message: 'Producto agregado al carrito' });
      });
    }
  });
};

// Eliminar producto del carrito (sin reintegrar stock)
const eliminarDelCarrito = (req, res) => {
  const { id_usuario, id_producto } = req.params;

  const eliminarSql = 'DELETE FROM Carrito WHERE id_usuario = ? AND id_producto = ?';
  db.query(eliminarSql, [id_usuario, id_producto], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar del carrito' });
    }

    res.status(200).json({ message: 'Producto eliminado del carrito' });
  });
};

// Actualizar cantidad en el carrito (solo validación de stock)
const actualizarCantidad = (req, res) => {
  const { id_usuario, id_producto, cantidad } = req.body;

  if (!id_usuario || !id_producto || cantidad == null) {
    return res.status(400).json({ error: 'Datos incompletos para actualizar la cantidad' });
  }

  const checkStockSql = 'SELECT stock FROM Producto WHERE id_producto = ?';
  db.query(checkStockSql, [id_producto], (err, stockResult) => {
    if (err || stockResult.length === 0) {
      return res.status(500).json({ error: 'Error al verificar stock' });
    }

    if (cantidad > stockResult[0].stock) {
      return res.status(400).json({ error: 'No hay suficiente stock disponible' });
    }

    // Actualizar cantidad sin tocar el stock
    carritoModel.actualizarCantidad(id_usuario, id_producto, cantidad, (err2) => {
      if (err2) {
        return res.status(500).json({ error: 'Error al actualizar la cantidad' });
      }

      res.status(200).json({ message: 'Cantidad actualizada con éxito' });
    });
  });
};

module.exports = {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidad,
  eliminarDelCarrito
};
