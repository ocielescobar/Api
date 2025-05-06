const express = require('express');
const router = express.Router();
const productoController = require('../controllers/ProductoController'); // Asegúrate de que la ruta del controlador sea correcta

// Obtener todos los productos
router.get('/producto', productoController.getProductos);

// Obtener un producto por su ID
router.get('/producto/:id', productoController.getProductoById);

// Crear un nuevo producto
router.post('/producto', productoController.createProducto);

// Actualizar un producto completo
router.put('/producto/:id', productoController.updateProducto);

// Actualizar parcialmente un producto
router.patch('/producto/:id', productoController.partialUpdateProducto);

// Eliminar un producto
router.delete('/producto/:id', productoController.deleteProducto);

module.exports = router;
