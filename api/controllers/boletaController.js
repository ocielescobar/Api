const db = require('../config/db');

// Confirmar compra y generar pedido (estado: pendiente de pago)
const confirmarCompra = (req, res) => {
  const { id_usuario } = req.body;

  if (!id_usuario) {
    return res.status(400).json({ error: 'Falta id_usuario' });
  }

  // Verificar si ya existe un pedido pendiente
  const verificarPendienteSql = `
    SELECT id_pedido FROM Pedido 
    WHERE id_cliente = ? AND estado_pedido = 1
  `;

  db.query(verificarPendienteSql, [id_usuario], (err0, pendientes) => {
    if (err0) return res.status(500).json({ error: 'Error al verificar pedidos pendientes' });
    if (pendientes.length > 0) {
      return res.status(400).json({
        error: 'Ya tienes una compra pendiente. Cancélala o págala antes de generar una nueva.',
        id_pedido: pendientes[0].id_pedido
      });
    }

    // Obtener productos del carrito
    const obtenerCarritoSql = `
      SELECT c.id_producto, c.cantidad, p.precio, p.stock 
      FROM Carrito c 
      JOIN Producto p ON c.id_producto = p.id_producto 
      WHERE c.id_usuario = ?
    `;

    db.query(obtenerCarritoSql, [id_usuario], (err, carrito) => {
      if (err) return res.status(500).json({ error: 'Error al obtener el carrito' });
      if (carrito.length === 0) return res.status(400).json({ error: 'El carrito está vacío' });

      // Calcular el total de la compra
      const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

      // Crear pedido con estado "pendiente de pago"
      const crearPedidoSql = `
        INSERT INTO Pedido (id_cliente, fecha_pedido, estado_pedido, tipo_entrega, metodo_pago, direccion_entrega, total)
        VALUES (?, NOW(), 1, 1, 1, 'Por definir', ?)
      `;

      db.query(crearPedidoSql, [id_usuario, total], (err2, result) => {
        if (err2) {
          console.error('Error al crear pedido:', err2);
          return res.status(500).json({ error: 'Error al crear el pedido' });
        }

        const id_pedido = result.insertId;

        // Insertar detalles del pedido
        const detalleSql = `
          INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
          VALUES ?
        `;
        const detalles = carrito.map(item => [
          id_pedido, item.id_producto, item.cantidad, item.precio
        ]);

        db.query(detalleSql, [detalles], (err3) => {
          if (err3) return res.status(500).json({ error: 'Error al insertar detalles del pedido' });

          // Vaciar el carrito después de confirmar el pedido
          const vaciarSql = 'DELETE FROM Carrito WHERE id_usuario = ?';
          db.query(vaciarSql, [id_usuario], (err5) => {
            if (err5) return res.status(500).json({ error: 'Error al vaciar carrito' });

            return res.status(200).json({
              message: 'Compra confirmada (pendiente de pago)',
              id_pedido,
              total
            });
          });
        });
      });
    });
  });
};


// Confirmar pago y actualizar estado del pedido + descontar stock
const pagarPedido = (req, res) => {
  const { id_pedido } = req.body;

  if (!id_pedido) return res.status(400).json({ error: 'Falta id_pedido' });

  const obtenerProductosSql = `
    SELECT id_producto, cantidad 
    FROM detalle_pedido 
    WHERE id_pedido = ?
  `;

  db.query(obtenerProductosSql, [id_pedido], (err, productos) => {
    if (err) return res.status(500).json({ error: 'Error al obtener productos del pedido' });

    const stockDescuentos = productos.map(item => {
      return new Promise((resolve, reject) => {
        const sql = 'UPDATE Producto SET stock = stock - ? WHERE id_producto = ?';
        db.query(sql, [item.cantidad, item.id_producto], (err2) => {
          if (err2) reject(err2);
          else resolve();
        });
      });
    });

    Promise.all(stockDescuentos)
      .then(() => {
        const actualizarEstadoSql = `
          UPDATE Pedido SET estado_pedido = 2 WHERE id_pedido = ?
        `;
        db.query(actualizarEstadoSql, [id_pedido], (err3) => {
          if (err3) return res.status(500).json({ error: 'Error al actualizar estado del pedido' });

          res.status(200).json({ message: 'Pago confirmado y stock actualizado' });
        });
      })
      .catch(err => {
        console.error('Error al descontar stock:', err);
        res.status(500).json({ error: 'Error al descontar stock' });
      });
  });
};

// Obtener boleta por ID de pedido
const obtenerBoleta = (req, res) => {
  const { id_pedido } = req.params;

  const sql = `
  SELECT p.nombre, p.imagen, d.cantidad, d.precio_unitario, 
         (d.cantidad * d.precio_unitario) AS total
  FROM detalle_pedido d
  JOIN Producto p ON d.id_producto = p.id_producto
  WHERE d.id_pedido = ?
`;


  db.query(sql, [id_pedido], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener boleta' });
    res.json(results);
  });
};

// Cancelar pedido (restituir stock y eliminar pedido + detalle)
const cancelarPedido = (req, res) => {
  const { id_pedido } = req.params;

  console.log("Cancelando pedido ID:", id_pedido);

  // Primero obtenemos el estado del pedido
  const estadoSql = 'SELECT estado_pedido FROM Pedido WHERE id_pedido = ?';
  db.query(estadoSql, [id_pedido], (errEstado, estadoResult) => {
    if (errEstado || estadoResult.length === 0) {
      console.error("Error al verificar estado del pedido:", errEstado);
      return res.status(500).json({ error: 'Error al verificar estado del pedido' });
    }

    const estado = estadoResult[0].estado_pedido;

    // Luego obtenemos los productos del pedido
    const obtenerDetalleSql = 'SELECT id_producto, cantidad FROM detalle_pedido WHERE id_pedido = ?';
    db.query(obtenerDetalleSql, [id_pedido], (err, detalles) => {
      if (err) {
        console.error("Error al obtener detalles:", err);
        return res.status(500).json({ error: 'Error al obtener detalles del pedido' });
      }

      if (detalles.length === 0) {
        console.warn("No hay detalles para este pedido");
        return res.status(400).json({ error: 'No hay productos asociados a este pedido' });
      }

      // Solo si el pedido fue pagado, devolver stock
      const accionesStock = estado === 2
        ? detalles.map(item => {
            return new Promise((resolve, reject) => {
              const updateSql = 'UPDATE Producto SET stock = stock + ? WHERE id_producto = ?';
              db.query(updateSql, [item.cantidad, item.id_producto], (err2) => {
                if (err2) reject(err2);
                else resolve();
              });
            });
          })
        : [];

      Promise.all(accionesStock)
        .then(() => {
          // Eliminar detalles del pedido
          db.query('DELETE FROM detalle_pedido WHERE id_pedido = ?', [id_pedido], (err3) => {
            if (err3) return res.status(500).json({ error: 'Error al eliminar detalles del pedido' });

            // Eliminar el pedido
            db.query('DELETE FROM Pedido WHERE id_pedido = ?', [id_pedido], (err4) => {
              if (err4) return res.status(500).json({ error: 'Error al eliminar el pedido' });

              const msg = estado === 2
                ? 'Pedido cancelado y stock devuelto correctamente'
                : 'Pedido cancelado con éxito';

              console.log(msg);
              res.status(200).json({ message: msg });
            });
          });
        })
        .catch(err => {
          console.error("Error al devolver stock:", err);
          res.status(500).json({ error: 'Error al devolver stock' });
        });
    });
  });
};

const obtenerEstadoPedido = (req, res) => {
  const { id_pedido } = req.params;
  const sql = 'SELECT estado_pedido FROM Pedido WHERE id_pedido = ?';
  db.query(sql, [id_pedido], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al consultar estado' });
    res.json(result[0]);
  });
};

const listarPedidosUsuario = (req, res) => {
  const { id_usuario } = req.params;

  const sql = `
    SELECT id_pedido, fecha_pedido, total, estado_pedido
    FROM Pedido
    WHERE id_cliente = ?
    ORDER BY fecha_pedido DESC
  `;

  db.query(sql, [id_usuario], (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al obtener pedidos' });
    res.json(resultados);
  });
};

const obtenerBoletasPagadas = (req, res) => {
  const sql = `
    SELECT id_pedido, total, fecha_pedido AS fecha
    FROM Pedido
    WHERE estado_pedido = 2
    ORDER BY fecha_pedido DESC
  `;

  db.query(sql, (err, resultados) => {
    if (err) {
      console.error("Error al obtener boletas pagadas:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    // Si llega aquí, imprime para depurar
    console.log("Boletas pagadas encontradas:", resultados);
    res.status(200).json(resultados);
  });
};


module.exports = {
  confirmarCompra,
  obtenerBoleta,
  cancelarPedido,
  pagarPedido,
  obtenerEstadoPedido,
  listarPedidosUsuario,
  obtenerBoletasPagadas,
};