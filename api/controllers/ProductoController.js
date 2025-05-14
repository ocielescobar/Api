const productoModel = require('../models/productoModel');

// Obtener productos
const obtenerProductos = (req, res) => {
  productoModel.obtenerProductos((err, productos) => {
    if (err) {
      console.error('Error al obtener productos:', err);  // Log para depurar el error
      return res.status(500).json({ error: 'Error al obtener los productos' });
    }
    res.json(productos);
  });
};

// Agregar producto
const agregarProducto = (req, res) => {
  const { codigo_producto, nombre, marca, categoria, descripcion, precio } = req.body;

  // Verificar  datos 
  if (!codigo_producto || !nombre || !marca || !categoria || !descripcion || !precio) {
    return res.status(400).json({ error: 'Faltan datos en la solicitud' });
  }

  // metodo para agregar producto
  productoModel.agregarProducto({ codigo_producto, nombre, marca, categoria, descripcion, precio }, (err, result) => {
    if (err) {
      console.error('Error al agregar el producto:', err);  // Log para capturar el error
      return res.status(500).json({ error: 'Error al agregar el producto' });
    }
    res.status(201).json({ message: 'Producto agregado con éxito', productoId: result.insertId });
  });
};

// Obtener producto por id
const obtenerProductoPorId = (req, res) => {
  const { id } = req.params;
  productoModel.obtenerProductoPorId(id, (err, producto) => {
    if (err) {
      console.error('Error al obtener producto:', err);  // Log para depurar el error
      return res.status(500).json({ error: 'Error al obtener el producto' });
    }
    if (!producto.length) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  });
};

// Eliminar producto por id
const eliminarProducto = (req, res) => {
  const { id } = req.params;

  // metodo para eliminar producto
  productoModel.eliminarProducto(id, (err, result) => {
    if (err) {
      console.error('Error al eliminar el producto:', err);  // Log para depurar el error
      return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
    res.status(200).json({ message: 'Producto eliminado con éxito' });
  });
};

// Actualizar producto por id
const actualizarProducto = (req, res) => {
  const { id } = req.params;
  const { codigo_producto, nombre, marca, categoria, descripcion, precio } = req.body;

  // Verificar datos
  if (!codigo_producto && !nombre && !marca && !categoria && !descripcion && !precio) {
    return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
  }

  // metodo para actualizar producto
  productoModel.actualizarProducto(id, { codigo_producto, nombre, marca, categoria, descripcion, precio }, (err, result) => {
    if (err) {
      console.error('Error al actualizar el producto:', err);  // Log para capturar el error
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
