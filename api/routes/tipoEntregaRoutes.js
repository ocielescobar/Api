const express = require('express');
const router = express.Router();
const tipoEntregaController = require('../controllers/tipoEntregaController');
router.get('/tipo_entrega', tipoEntregaController.obtenerTiposEntrega);
router.get('/tipo_entrega/:id', tipoEntregaController.obtenerTipoEntregaPorId);
router.delete('/tipo_entrega/:id', tipoEntregaController.eliminarTipoEntrega);
router.patch('/tipo_entrega/:id', tipoEntregaController.actualizarTipoEntrega);

module.exports = router;
