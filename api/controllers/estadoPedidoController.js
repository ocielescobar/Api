const estadoPedidoModel = require('../models/estadoPedidoModel');

// Obtener estado pedido
const obtenerEstadoPedidos = (req, res) => {
  estadoPedidoModel.obtenerEstadoPedidos((err, estadoPedidos) => {
    if (err) {
      console.error('Error al obtener estados de pedidos:', err);
      return res.status(500).json({ error: 'Error al obtener los estados de pedidos' });
    }
    res.json(estadoPedidos);
  });
};

// Agregar estado pedido
const agregarEstadoPedido = (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  estadoPedidoModel.agregarEstadoPedido({ nombre }, (err, result) => {
    if (err) {
      console.error('Error al agregar el estado de pedido:', err);
      return res.status(500).json({ error: 'Error al agregar el estado de pedido' });
    }
    res.status(201).json({ message: 'Estado de pedido agregado con éxito', estadoId: result.insertId });
  });
};

// Actualizar estado pedido
const actualizarEstadoPedido = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'Debe proporcionar el nombre del estado' });
  }

  estadoPedidoModel.actualizarEstadoPedido(id, { nombre }, (err, result) => {
    if (err) {
      console.error('Error al actualizar el estado de pedido:', err);
      return res.status(500).json({ error: 'Error al actualizar el estado de pedido' });
    }
    res.status(200).json({ message: 'Estado de pedido actualizado con éxito' });
  });
};

// Eliminar estado pedido
const eliminarEstadoPedido = (req, res) => {
  const { id } = req.params;

  estadoPedidoModel.eliminarEstadoPedido(id, (err, result) => {
    if (err) {
      console.error('Error al eliminar el estado de pedido:', err);
      return res.status(500).json({ error: 'Error al eliminar el estado de pedido' });
    }
    res.status(200).json({ message: 'Estado de pedido eliminado con éxito' });
  });
};

module.exports = {
  obtenerEstadoPedidos,
  agregarEstadoPedido,
  actualizarEstadoPedido,
  eliminarEstadoPedido
};
