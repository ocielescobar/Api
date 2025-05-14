const inventarioModel = require('../models/inventarioModel');

// Obtener inventarios
const obtenerInventarios = (req, res) => {
  inventarioModel.obtenerInventarios((err, inventarios) => {
    if (err) {
      console.error('Error al obtener inventarios:', err);
      return res.status(500).json({ error: 'Error al obtener los inventarios' });
    }
    res.json(inventarios);
  });
};

// Agregar nuevo inventario
const agregarInventario = (req, res) => {
  const { id_producto, id_sucursal, stock } = req.body;

  if (!id_producto || !id_sucursal || !stock) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  inventarioModel.agregarInventario({ id_producto, id_sucursal, stock }, (err, result) => {
    if (err) {
      console.error('Error al agregar el inventario:', err);
      return res.status(500).json({ error: 'Error al agregar el inventario' });
    }
    res.status(201).json({ message: 'Inventario agregado con éxito', inventarioId: result.insertId });
  });
};

// Actualizar inventario
const actualizarInventario = (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;

  if (!stock) {
    return res.status(400).json({ error: 'Debe proporcionar el nuevo stock' });
  }

  inventarioModel.actualizarInventario(id, { stock }, (err, result) => {
    if (err) {
      console.error('Error al actualizar el inventario:', err);
      return res.status(500).json({ error: 'Error al actualizar el inventario' });
    }
    res.status(200).json({ message: 'Inventario actualizado con éxito' });
  });
};

// Eliminar inventario
const eliminarInventario = (req, res) => {
  const { id } = req.params;

  inventarioModel.eliminarInventario(id, (err, result) => {
    if (err) {
      console.error('Error al eliminar el inventario:', err);
      return res.status(500).json({ error: 'Error al eliminar el inventario' });
    }
    res.status(200).json({ message: 'Inventario eliminado con éxito' });
  });
};

module.exports = {
  obtenerInventarios,
  agregarInventario,
  actualizarInventario,
  eliminarInventario
};
