const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const ProductoRoutes = require('./routes/ProductoRoutes');
const sucursalRoutes = require('./routes/sucursalRoutes');
const inventarioRoutes = require('./routes/inventarioRoutes');
const estadoPedidoRoutes = require('./routes/estadoPedidoRoutes');
const tipoEntregaRoutes = require ('./routes/tipoEntregaRoutes');
const carritoRoutes = require('./routes/carritoRoutes');
const webpayRoutes = require('./routes/webpayRoutes');
const authController = require('./controllers/authController');
//const compraRoutes = require('./routes/compraRoutes');
const boletaRoutes = require('./routes/boletaRoutes');
const bancoCentralRoutes = require('./routes/bancoCentralRoutes');


app.use(express.json());
//app.use('/login', authRoutes);

// Usa las rutas de auth
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes);
app.use('/api', ProductoRoutes);
app.use('/api', sucursalRoutes);
app.use('/api', inventarioRoutes);
app.use('/api', estadoPedidoRoutes);
app.use('/api', tipoEntregaRoutes);
app.use('/api', carritoRoutes);
app.use('/webpay', webpayRoutes);
//app.use('/api/compra', compraRoutes);
app.use('/api/boleta', boletaRoutes);
app.use(bancoCentralRoutes);
app.use('/uploads', express.static('uploads'));


app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});