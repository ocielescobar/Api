const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const ProductoRoutes = require('./routes/ProductoRoutes');
const sucursalRoutes = require('./routes/sucursalRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const estadoPedidoRoutes = require('./routes/estadoPedidoRoutes');
const tipoEntregaRoutes = require ('./routes/tipoEntregaRoutes');
const carritoRoutes = require('./routes/carritoRoutes');
app.use(express.json());
//app.use('/login', authRoutes);

// Usa las rutas de auth
app.use('/api', authRoutes);
app.use('/api', ProductoRoutes);
app.use('/api', sucursalRoutes);
app.use('/api', inventarioRoutes);
app.use('/api', estadoPedidoRoutes);
app.use('/api', tipoEntregaRoutes);
app.use('/api', carritoRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});