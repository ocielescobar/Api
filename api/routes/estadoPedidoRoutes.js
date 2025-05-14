const express = require('express');
const router = express.Router();
const estadoPedidoController = require('../controllers/estadoPedidoController');
router.get('/estadoPedidos', estadoPedidoController.obtenerEstadoPedidos);
router.post('/estadoPedidos', estadoPedidoController.agregarEstadoPedido);
router.patch('/estadoPedidos/:id', estadoPedidoController.actualizarEstadoPedido);
router.delete('/estadoPedidos/:id', estadoPedidoController.eliminarEstadoPedido);

module.exports = router;
