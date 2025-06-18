// routes/bancoCentralRoutes.js
const express = require("express");
const router = express.Router();
const bancoCentralController = require("../controllers/bancoCentralController"); // ✅ IMPORTACIÓN NECESARIA

router.get('/api/banco/dolar', bancoCentralController.obtenerDolar);

module.exports = router;
