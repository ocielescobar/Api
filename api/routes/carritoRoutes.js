const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
router.get('/carrito/:id_usuario', carritoController.obtenerCarrito);
router.post('/carrito', carritoController.agregarAlCarrito);
router.patch('/carrito', carritoController.actualizarCantidad);
router.delete('/carrito/:id_usuario/:id_producto', carritoController.eliminarDelCarrito);

module.exports = router;
