const express = require('express');
const router = express.Router();
const boletaController = require('../controllers/boletaController');

router.post('/confirmar', boletaController.confirmarCompra);
router.get('/:id_pedido', boletaController.obtenerBoleta);
router.post('/cancelar/:id_pedido', boletaController.cancelarPedido); 
router.get('/usuario/:id_usuario', boletaController.listarPedidosUsuario);
router.get('/pagadas', boletaController.obtenerBoletasPagadas);

router.get('/debug/pedidos2', (req, res) => {
  const db = require('../config/db');
  db.query("SELECT * FROM Pedido WHERE estado_pedido = 2", (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});
module.exports = router;