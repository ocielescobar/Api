const express = require('express');
const router = express.Router();
const estadoPedidoController = require('../controllers/estadoPedidoController');

// Ruta para obtener todos los estados de pedidos
router.get('/', estadoPedidoController.getEstadosPedido);

// Ruta para obtener un estado de pedido por id
router.get('/:id', estadoPedidoController.getEstadoPedidoById);

// Ruta para agregar un nuevo estado de pedido
router.post('/', estadoPedidoController.addEstadoPedido);

// Ruta para actualizar un estado de pedido por id
router.put('/:id', estadoPedidoController.updateEstadoPedido);

// Ruta para actualizar parcialmente un estado de pedido por id
router.patch('/:id', estadoPedidoController.updatePartialEstadoPedido);

// Ruta para eliminar un estado de pedido por id
router.delete('/:id', estadoPedidoController.deleteEstadoPedido);

module.exports = router;
