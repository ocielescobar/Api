const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventarioController');
router.get('/inventarios', inventarioController.obtenerInventarios);
router.post('/inventarios', inventarioController.agregarInventario);
router.patch('/inventarios/:id', inventarioController.actualizarInventario);
router.delete('/inventarios/:id', inventarioController.eliminarInventario);

module.exports = router;
