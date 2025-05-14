const tipoEntregaModel = require('../models/tipoEntregaModel');

// Obtener tipos de entrega
const obtenerTiposEntrega = (req, res) => {
  tipoEntregaModel.obtenerTiposEntrega((err, tipos) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los tipos de entrega' });
    }
    res.json(tipos);
  });
};

// Obtener tipo de entrega por id
const obtenerTipoEntregaPorId = (req, res) => {
  const { id } = req.params;
  tipoEntregaModel.obtenerTipoEntregaPorId(id, (err, tipo) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener el tipo de entrega' });
    }
    if (!tipo.length) {
      return res.status(404).json({ error: 'Tipo de entrega no encontrado' });
    }
    res.json(tipo);
  });
};

// Eliminar tipo de entrega por id
const eliminarTipoEntrega = (req, res) => {
  const { id } = req.params;
  tipoEntregaModel.eliminarTipoEntrega(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar el tipo de entrega' });
    }
    if (result.mensaje === 'Tipo de entrega no encontrado') {
      return res.status(404).json({ error: result.mensaje });
    }
    res.json(result);
  });
};

// Actualizar tipo de entrega por id
const actualizarTipoEntrega = (req, res) => {
  const { id } = req.params;
  const datosActualizados = req.body;
  tipoEntregaModel.actualizarTipoEntrega(id, datosActualizados, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar el tipo de entrega' });
    }
    if (result.mensaje === 'Tipo de entrega no encontrado') {
      return res.status(404).json({ error: result.mensaje });
    }
    res.json(result);
  });
};

module.exports = {
  obtenerTiposEntrega,
  obtenerTipoEntregaPorId,
  eliminarTipoEntrega,
  actualizarTipoEntrega,
};
