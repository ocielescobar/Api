// routes/inventarioRoutes.js
const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');

// Rutas CRUD
router.get('/', inventarioController.getInventarios);
router.get('/:id', inventarioController.getInventarioById);
router.post('/', inventarioController.createInventario);
router.put('/:id', inventarioController.updateInventario);
router.patch('/:id', inventarioController.partialUpdateInventario);
router.delete('/:id', inventarioController.deleteInventario);

module.exports = router;
