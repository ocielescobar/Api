const carritoModel = require('../models/carritoModel');

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

// Agregar un producto al carrito
const agregarAlCarrito = (req, res) => {
  const { id_usuario, id_producto, cantidad } = req.body;

  // Verificacion de datos
  if (!id_usuario || !id_producto || !cantidad) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  carritoModel.agregarAlCarrito(id_usuario, id_producto, cantidad, (err, result) => {
    if (err) {
      console.error('Error al agregar al carrito:', err);
      return res.status(500).json({ error: 'Error al agregar al carrito' });
    }
    res.status(201).json({ message: 'Producto agregado al carrito con éxito' });
  });
};

// Actualizar cantidad del carrito
const actualizarCantidad = (req, res) => {
  const { id_usuario, id_producto, cantidad } = req.body;

  if (!cantidad) {
    return res.status(400).json({ error: 'Debe proporcionar la nueva cantidad' });
  }

  carritoModel.actualizarCantidad(id_usuario, id_producto, cantidad, (err, result) => {
    if (err) {
      console.error('Error al actualizar la cantidad:', err);
      return res.status(500).json({ error: 'Error al actualizar la cantidad' });
    }
    res.status(200).json({ message: 'Cantidad actualizada con éxito' });
  });
};

// Eliminar producto del carrito
const eliminarDelCarrito = (req, res) => {
  const { id_usuario, id_producto } = req.params;

  carritoModel.eliminarDelCarrito(id_usuario, id_producto, (err, result) => {
    if (err) {
      console.error('Error al eliminar del carrito:', err);
      return res.status(500).json({ error: 'Error al eliminar del carrito' });
    }
    res.status(200).json({ message: 'Producto eliminado del carrito con éxito' });
  });
};

module.exports = {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidad,
  eliminarDelCarrito
};
