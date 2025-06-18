// controllers/bancoCentralController.js
const axios = require("axios");

exports.obtenerDolar = async (req, res) => {
  try {
    const respuesta = await axios.get("https://mindicador.cl/api/dolar");
    const valorDolar = respuesta.data.serie[0].valor;
    res.json({ dolar: valorDolar });
  } catch (error) {
    console.error("Error al obtener valor del dólar:", error);
    res.status(500).json({ error: "No se pudo obtener el valor del dólar" });
  }
};
