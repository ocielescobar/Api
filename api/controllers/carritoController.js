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
  const { id_usuario, id_producto, cantidad } = req.body;

  if (!id_usuario || !id_producto || !cantidad) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  const checkStockSql = 'SELECT stock FROM Producto WHERE id_producto = ?';
  db.query(checkStockSql, [id_producto], (err, stockResult) => {
    if (err || stockResult.length === 0) {
      return res.status(500).json({ error: 'Error al verificar stock' });
    }

    const stockDisponible = stockResult[0].stock;

    if (cantidad > stockDisponible) {
      return res.status(400).json({ error: 'No hay stock suficiente' });
    }

    // Agregar al carrito (sin tocar el stock)
    carritoModel.agregarAlCarrito(id_usuario, id_producto, cantidad, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al agregar al carrito' });
      }

      res.status(201).json({ message: 'Producto agregado al carrito con éxito' });
    });
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
