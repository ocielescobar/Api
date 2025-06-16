const express = require("express");
const router = express.Router();
const { WebpayPlus } = require("transbank-sdk");
const db = require("../config/db");

const buyOrderGenerator = () => "orden_" + Math.floor(Math.random() * 10000000);

// POST /api/compra/crear
router.post("/crear", async (req, res) => {
  const { id_usuario } = req.body;

  // Buscar productos del carrito
  db.query(
    `SELECT p.precio, c.cantidad FROM Carrito c INNER JOIN Producto p ON c.id_producto = p.id_producto WHERE c.id_usuario = ?`,
    [id_usuario],
    async (err, resultados) => {
      if (err || resultados.length === 0) {
        return res.status(400).json({ error: "Carrito vacío o error interno" });
      }

      const total = resultados.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

      const buyOrder = buyOrderGenerator();
      const sessionId = id_usuario + "_" + Date.now();
      const returnUrl = "http://localhost:3000/api/compra/confirmar";

      try {
        const createResponse = await new WebpayPlus.Transaction().create(
          buyOrder,
          sessionId,
          total,
          returnUrl
        );
        res.json({ url: createResponse.url, token: createResponse.token });
      } catch (e) {
        console.error("Error con Transbank:", e);
        res.status(500).json({ error: "Error con Transbank" });
      }
    }
  );
});

module.exports = router;
