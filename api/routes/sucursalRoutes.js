const express = require('express');
const router = express.Router();
const SucursalController = require('../controllers/sucursalController');

// Rutas CRUD
router.get('/', SucursalController.getAll);
router.get('/:id', SucursalController.getById);
router.post('/', SucursalController.create);
router.put('/:id', SucursalController.update);
router.patch('/:id', SucursalController.patch);
router.delete('/:id', SucursalController.delete);

module.exports = router;
