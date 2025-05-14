const express = require('express');
const router = express.Router();
const productoController = require('../controllers/ProductoController');
router.get('/productos', productoController.obtenerProductos);
router.get('/productos/:id', productoController.obtenerProductoPorId);
router.post('/productos', productoController.agregarProducto);
router.delete('/productos/:id', productoController.eliminarProducto);
router.patch('/productos/:id', productoController.actualizarProducto);

module.exports = router;
