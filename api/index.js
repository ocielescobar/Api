const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const ProductoRoutes = require('./routes/ProductoRoutes');
const sucursalRoutes = require('./routes/sucursalRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const estadoPedidoRoutes = require('./routes/estadoPedidoRoutes');

app.use(express.json());
//app.use('/login', authRoutes);

// Usa las rutas de auth
app.use('/api/auth', authRoutes);
app.use('/api', ProductoRoutes);
app.use('/api/sucursal', sucursalRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/estado_pedido', estadoPedidoRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});