const { Options, IntegrationCommerceCodes, IntegrationApiKeys, WebpayPlus } = require('transbank-sdk');
const db = require('../config/db');
const { pagarPedido } = require('./boletaController');

// Configuración en modo integración
const options = new Options(
  IntegrationCommerceCodes.WEBPAY_PLUS,
  IntegrationApiKeys.WEBPAY,
  'https://webpay3gint.transbank.cl'
);

// Iniciar transacción
const iniciarTransaccion = async (req, res) => {
  const { id_pedido, monto } = req.body;
  const returnUrl = 'http://localhost:3000/webpay/respuesta';

  try {
    console.log("Iniciando transacción con:", { id_pedido, monto });

    const tx = new WebpayPlus.Transaction(options);

    // Enviamos buyOrder como `pedido-<id>` y sessionId como el mismo id_pedido
    const result = await tx.create(`pedido-${id_pedido}`, `${id_pedido}`, monto, returnUrl);

    res.json({ url: result.url, token: result.token });
  } catch (err) {
    console.error('Error al iniciar transacción:', err);
    res.status(500).json({ error: 'Error al iniciar pago con Webpay' });
  }
};

// Procesar respuesta de Webpay
const respuestaTransbank = async (req, res) => {
  const token = req.query.token_ws;

  if (!token) return res.status(400).send('Token inválido');

  try {
    const tx = new WebpayPlus.Transaction(options);
    const result = await tx.commit(token);

    console.log('Resultado Webpay:', result);

    const { buy_order, session_id, amount, response_code, status, card_detail, authorization_code } = result;

    const id_pedido = buy_order?.replace('pedido-', '');

if (!id_pedido) {
  console.error('buyOrder inválido:', buy_order);
  return res.status(500).send('ID de pedido inválido');
}

    // Guardar transacción en la base de datos
    const insertSql = `
  INSERT INTO transacciones_webpay (token, id_pedido, autorizacion_code, response_code, amount, card_number, status)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

const params = [
  token,
  id_pedido,
  authorization_code || 'N/A',
  response_code,
  amount,
  card_detail?.card_number || 'XXXX-XXXX',
  status || 'UNKNOWN'
];

    db.query(insertSql, params, (err) => {
      if (err) {
        console.error('Error al guardar transacción:', err);
        return res.status(500).send('Error al registrar la transacción.');
      }

      // Confirmar el pedido solo si el pago fue exitoso
      if (response_code === 0) {
        console.log('Pago aprobado, actualizando estado...');
        pagarPedido({ body: { id_pedido } }, {
          status: (code) => ({
            json: (data) => {
              console.log('Respuesta de pagarPedido:', code, data);
              if (code === 200) {
                return res.redirect(`http://localhost:8081/boleta/${id_pedido}`);
              } else {
                return res.status(500).send('Pago registrado pero no se pudo actualizar el pedido.');
              }
            }
          })
        });
      } else {
        return res.status(400).send('Pago rechazado por Webpay.');
      }
    });
  } catch (error) {
    console.error('Error en respuesta transacción:', error);
    res.status(500).send('Error al procesar respuesta de Webpay.');
  }
};

// Ver historial de transacciones
const obtenerTransacciones = (req, res) => {
  const sql = `
    SELECT t.id_transaccion, t.id_pedido, t.monto, t.fecha_transaccion, u.nombre AS usuario
    FROM transacciones_webpay t
    JOIN Pedido p ON t.id_pedido = p.id_pedido
    JOIN Usuario u ON p.id_cliente = u.id_usuario
    ORDER BY t.fecha_transaccion DESC
  `;

  db.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al obtener transacciones' });
    res.json(resultados);
  });
};


module.exports = {
  iniciarTransaccion,
  respuestaTransbank,
  obtenerTransacciones
};
