const express = require('express');
const router = express.Router();
const { iniciarTransaccion, respuestaTransbank, obtenerTransacciones } = require('../controllers/webpayController');

router.post('/iniciar-transaccion', iniciarTransaccion);
router.get('/respuesta', respuestaTransbank);
router.get('/historial', obtenerTransacciones);

module.exports = router;
