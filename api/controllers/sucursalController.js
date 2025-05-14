const sucursalModel = require('../models/sucursalModel');

// Obtener sucursales
const obtenerSucursales = (req, res) => {
  sucursalModel.obtenerSucursales((err, sucursales) => {
    if (err) {
      console.error('Error al obtener sucursales:', err);
      return res.status(500).json({ error: 'Error al obtener las sucursales' });
    }
    res.json(sucursales);
  });
};

// Agregar sucursal
const agregarSucursal = (req, res) => {
  const { nombre, direccion } = req.body;

  if (!nombre || !direccion) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  sucursalModel.agregarSucursal({ nombre, direccion }, (err, result) => {
    if (err) {
      console.error('Error al agregar la sucursal:', err);
      return res.status(500).json({ error: 'Error al agregar la sucursal' });
    }
    res.status(201).json({ message: 'Sucursal agregada con éxito', sucursalId: result.insertId });
  });
};

// Actualizar sucursal
const actualizarSucursal = (req, res) => {
  const { id } = req.params;
  const { nombre, direccion } = req.body;

  if (!nombre && !direccion) {
    return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
  }

  sucursalModel.actualizarSucursal(id, { nombre, direccion }, (err, result) => {
    if (err) {
      console.error('Error al actualizar la sucursal:', err);
      return res.status(500).json({ error: 'Error al actualizar la sucursal' });
    }
    res.status(200).json({ message: 'Sucursal actualizada con éxito' });
  });
};

// Eliminar sucursal
const eliminarSucursal = (req, res) => {
  const { id } = req.params;

  sucursalModel.eliminarSucursal(id, (err, result) => {
    if (err) {
      console.error('Error al eliminar la sucursal:', err);
      return res.status(500).json({ error: 'Error al eliminar la sucursal' });
    }
    res.status(200).json({ message: 'Sucursal eliminada con éxito' });
  });
};

module.exports = {
  obtenerSucursales,
  agregarSucursal,
  actualizarSucursal,
  eliminarSucursal
};
