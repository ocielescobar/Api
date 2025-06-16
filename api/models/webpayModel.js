const { WebpayPlus, Options, IntegrationCommerceCodes, IntegrationApiKeys, Environment } = require('transbank-sdk');

// Configurar el entorno de integración usando Environment.Integration (versión 3.x)
const options = new Options(
  IntegrationCommerceCodes.WEBPAY_PLUS,
  IntegrationApiKeys.WEBPAY,
  Environment.Integration
);

// Crear una transacción
const crearTransaccion = async (buyOrder, sessionId, amount, returnUrl) => {
  const tx = new WebpayPlus.Transaction(options);
  return await tx.create(buyOrder, sessionId, amount, returnUrl);
};

// Confirmar una transacción
const confirmarTransaccion = async (token) => {
  const tx = new WebpayPlus.Transaction(options);
  return await tx.commit(token);
};

module.exports = {
  crearTransaccion,
  confirmarTransaccion
};
