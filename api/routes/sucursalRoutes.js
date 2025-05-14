const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');
router.get('/sucursales', sucursalController.obtenerSucursales);
router.post('/sucursales', sucursalController.agregarSucursal);
router.patch('/sucursales/:id', sucursalController.actualizarSucursal);
router.delete('/sucursales/:id', sucursalController.eliminarSucursal);

module.exports = router;
