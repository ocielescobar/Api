const express = require('express');
const router = express.Router();
const tipoEntregaController = require('../controllers/tipoEntregaController');

// Obtener todos los tipos de entrega
router.get('/', tipoEntregaController.getAllTipoEntrega);

// Obtener un tipo de entrega por ID
router.get('/:id', tipoEntregaController.getTipoEntregaById);

// Crear un nuevo tipo de entrega
router.post('/', tipoEntregaController.createTipoEntrega);

// Actualizar un tipo de entrega (PUT)
router.put('/:id', tipoEntregaController.updateTipoEntrega);

// Actualizar parcialmente un tipo de entrega (PATCH)
router.patch('/:id', tipoEntregaController.partialUpdateTipoEntrega);

// Eliminar un tipo de entrega
router.delete('/:id', tipoEntregaController.deleteTipoEntrega);

module.exports = router;
