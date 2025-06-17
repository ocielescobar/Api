## 🚀 Requisitos Previos

Antes de comenzar asegúrate de tener instalado:

- Node.js y npm: https://nodejs.org/
- MySQL Server en tu máquina local
- Un editor de código como Visual Studio Code
- Postman u otra herramienta para probar endpoints

---

## 🧱 Estructura del Proyecto

```
api-login-node/
│
├── config/
│   └── db.js          # Conexión a la base de datos
│
├── controllers/
│   └── authController.js   # Lógica del login
│
├── routes/
│   └── authRoutes.js       # Rutas para /login
│
├── .env               # Variables de entorno
├── index.js           # Arranque de la aplicación
├── package.json
└── README.md
```

---

## 🛠️ Paso 1: Crear el proyecto

```bash
mkdir api-login-node
cd api-login-node
npm init -y
```

Instala las dependencias necesarias:

```bash
npm install express mysql dotenv
```

---

## 🗄️ Paso 2: Crear la base de datos y el usuario en MySQL

Abre tu cliente MySQL y ejecuta lo siguiente:

```sql
-- Crear el esquema
CREATE SCHEMA `tienda_db` DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;

-- Crear el usuario
CREATE USER 'administrador'@'localhost' IDENTIFIED BY 'yR!9uL2@pX';

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON tienda_db.* TO 'administrador'@'localhost';
FLUSH PRIVILEGES;

-- Asegurar compatibilidad del método de autenticación
ALTER USER 'administrador'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yR!9uL2@pX';
FLUSH PRIVILEGES;

-- Crear las tablas
USE tienda_db;

CREATE TABLE IF NOT EXISTS usuario (
  id_usuario INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) DEFAULT NULL,
  correo VARCHAR(100) DEFAULT NULL,
  contrasena VARCHAR(100) DEFAULT NULL,
  rut VARCHAR(20) DEFAULT NULL,
  rol VARCHAR(100) DEFAULT NULL,
  fecha DATE DEFAULT NULL,
  PRIMARY KEY (id_usuario),
  UNIQUE KEY correo (correo)
);

CREATE TABLE IF NOT EXISTS producto (
  id_producto INT(11) NOT NULL AUTO_INCREMENT,
  codigo_producto VARCHAR(50) DEFAULT NULL,
  nombre VARCHAR(100) DEFAULT NULL,
  marca VARCHAR(50) DEFAULT NULL,
  categoria VARCHAR(50) DEFAULT NULL,
  descripcion TEXT DEFAULT NULL,
  precio DECIMAL(10,2) DEFAULT NULL,
  stock INT(11) DEFAULT 0,
  PRIMARY KEY (id_producto)
);

CREATE TABLE IF NOT EXISTS carrito (
  id_carrito INT(11) NOT NULL AUTO_INCREMENT,
  id_usuario INT(11) DEFAULT NULL,
  id_producto INT(11) DEFAULT NULL,
  cantidad INT(11) DEFAULT NULL,
  PRIMARY KEY (id_carrito),
  KEY id_usuario (id_usuario),
  KEY id_producto (id_producto),
  CONSTRAINT carrito_ibfk_1 FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
  CONSTRAINT carrito_ibfk_2 FOREIGN KEY (id_producto) REFERENCES producto (id_producto)
);

CREATE TABLE IF NOT EXISTS contacto (
  id_contacto INT(11) NOT NULL AUTO_INCREMENT,
  id_cliente INT(11) DEFAULT NULL,
  mensaje TEXT DEFAULT NULL,
  fecha DATE DEFAULT NULL,
  PRIMARY KEY (id_contacto),
  KEY id_cliente (id_cliente),
  CONSTRAINT contacto_ibfk_1 FOREIGN KEY (id_cliente) REFERENCES usuario (id_usuario)
);

CREATE TABLE IF NOT EXISTS estado_pedido (
  id_estado INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (id_estado)
);

CREATE TABLE IF NOT EXISTS tipo_entrega (
  id_tipo_entrega INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (id_tipo_entrega)
);

CREATE TABLE IF NOT EXISTS metodo_pago (
  id_metodo_pago INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) DEFAULT NULL,
  PRIMARY KEY (id_metodo_pago)
);

CREATE TABLE IF NOT EXISTS pedido (
  id_pedido INT(11) NOT NULL AUTO_INCREMENT,
  id_cliente INT(11) DEFAULT NULL,
  fecha_pedido DATE DEFAULT NULL,
  estado_pedido INT(11) DEFAULT NULL,
  tipo_entrega INT(11) DEFAULT NULL,
  direccion_entrega TEXT DEFAULT NULL,
  metodo_pago INT(11) DEFAULT NULL,
  total DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (id_pedido),
  KEY id_cliente (id_cliente),
  KEY estado_pedido (estado_pedido),
  KEY tipo_entrega (tipo_entrega),
  KEY metodo_pago (metodo_pago),
  CONSTRAINT pedido_ibfk_1 FOREIGN KEY (id_cliente) REFERENCES usuario (id_usuario),
  CONSTRAINT pedido_ibfk_2 FOREIGN KEY (estado_pedido) REFERENCES estado_pedido (id_estado),
  CONSTRAINT pedido_ibfk_3 FOREIGN KEY (tipo_entrega) REFERENCES tipo_entrega (id_tipo_entrega),
  CONSTRAINT pedido_ibfk_4 FOREIGN KEY (metodo_pago) REFERENCES metodo_pago (id_metodo_pago)
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
  id_detalle_pedido INT(11) NOT NULL AUTO_INCREMENT,
  id_pedido INT(11) DEFAULT NULL,
  id_producto INT(11) DEFAULT NULL,
  cantidad INT(11) DEFAULT NULL,
  precio_unitario DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (id_detalle_pedido),
  KEY id_pedido (id_pedido),
  KEY id_producto (id_producto),
  CONSTRAINT detalle_pedido_ibfk_1 FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido),
  CONSTRAINT detalle_pedido_ibfk_2 FOREIGN KEY (id_producto) REFERENCES producto (id_producto)
);

CREATE TABLE IF NOT EXISTS sucursal (
  id_sucursal INT(11) NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) DEFAULT NULL,
  direccion TEXT DEFAULT NULL,
  PRIMARY KEY (id_sucursal)
);

CREATE TABLE IF NOT EXISTS inventario (
  id_inventario INT(11) NOT NULL AUTO_INCREMENT,
  id_producto INT(11) DEFAULT NULL,
  id_sucursal INT(11) DEFAULT NULL,
  stock INT(11) DEFAULT NULL,
  PRIMARY KEY (id_inventario),
  KEY id_producto (id_producto),
  KEY id_sucursal (id_sucursal),
  CONSTRAINT inventario_ibfk_1 FOREIGN KEY (id_producto) REFERENCES producto (id_producto),
  CONSTRAINT inventario_ibfk_2 FOREIGN KEY (id_sucursal) REFERENCES sucursal (id_sucursal)
);

CREATE TABLE IF NOT EXISTS pago (
  id_pago INT(11) NOT NULL AUTO_INCREMENT,
  id_pedido INT(11) DEFAULT NULL,
  fecha_pago DATE DEFAULT NULL,
  metodo_pago INT(11) DEFAULT NULL,
  estado VARCHAR(50) DEFAULT NULL,
  monto DECIMAL(10,2) DEFAULT NULL,
  PRIMARY KEY (id_pago),
  KEY id_pedido (id_pedido),
  KEY metodo_pago (metodo_pago),
  CONSTRAINT pago_ibfk_1 FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido),
  CONSTRAINT pago_ibfk_2 FOREIGN KEY (metodo_pago) REFERENCES metodo_pago (id_metodo_pago)
);

CREATE TABLE IF NOT EXISTS suscripcion (
  id_suscripcion INT(11) NOT NULL AUTO_INCREMENT,
  id_usuario INT(11) DEFAULT NULL,
  correo VARCHAR(100) DEFAULT NULL,
  fecha_suscripcion DATE DEFAULT NULL,
  PRIMARY KEY (id_suscripcion),
  KEY id_usuario (id_usuario),
  CONSTRAINT suscripcion_ibfk_1 FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
);

CREATE TABLE IF NOT EXISTS transacciones_webpay (
  id INT(11) NOT NULL AUTO_INCREMENT,
  token VARCHAR(255) NOT NULL,
  id_pedido INT(11) NOT NULL,
  autorizacion_code VARCHAR(20) DEFAULT NULL,
  response_code INT(11) DEFAULT NULL,
  amount INT(11) DEFAULT NULL,
  card_number VARCHAR(20) DEFAULT NULL,
  status VARCHAR(50) DEFAULT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY id_pedido (id_pedido),
  CONSTRAINT transacciones_webpay_ibfk_1 FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido)
);

-- Poblar Las tablas

-- poblar usuario
INSERT INTO Usuario (nombre, correo, contrasena, rut, rol, fecha) VALUES
('Ana López', 'ana.lopez@example.com', 'pass123', '11111111-1', 'cliente', NOW()),
('Carlos Díaz', 'carlos.diaz@example.com', 'carlospass', '22222222-2', 'cliente', NOW()),
('Beatriz Rojas', 'beatriz.rojas@example.com', 'rojas2025', '33333333-3', 'cliente', NOW()),
('Daniel Soto', 'daniel.soto@example.com', 'soto321', '44444444-4', 'cliente', NOW()),
('Elena Pérez', 'elena.perez@example.com', 'eperez', '55555555-5', 'cliente', NOW()),
('Francisco Vidal', 'francisco.vidal@example.com', 'fvidal123', '66666666-6', 'cliente', NOW()),
('Gabriela Ruiz', 'gabriela.ruiz@example.com', 'gabypass', '77777777-7', 'cliente', NOW()),
('Héctor Mora', 'hector.mora@example.com', 'hmora2025', '88888888-8', 'cliente', NOW()),
('Isabel Torres', 'isabel.torres@example.com', 'torres456', '99999999-9', 'cliente', NOW()),
('Jorge Fuentes', 'jorge.fuentes@example.com', 'fuentes789', '12345678-0', 'cliente', NOW());

-- poblar producto
INSERT INTO Producto (codigo_producto, nombre, marca, categoria, descripcion, precio, stock) VALUES
('P001', 'Papel Higiénico Doble Hoja', 'Elite', 'Higiene', 'Papel suave y resistente, 30 metros.', 2990, 10),
('P002', 'Jabón Líquido Antibacterial', 'Lysol', 'Higiene', 'Jabón líquido con dispensador, 500 ml.', 3290, 10),
('P003', 'Detergente Ropa Líquido', 'Ariel', 'Limpieza', 'Detergente para ropa blanca y color, 3 L.', 8490, 10),
('P004', 'Toallas de Papel', 'Scott', 'Higiene', 'Toallas de papel absorbentes, paquete de 2.', 1890, 10),
('P005', 'Desinfectante Multiusos', 'Virutex', 'Limpieza', 'Desinfectante para superficies, 1 L.', 4590, 10),
('P006', 'Cloro Gel', 'Clorox', 'Limpieza', 'Cloro en gel, fragancia lavanda, 900 ml.', 2790, 10),
('P007', 'Limpiavidrios', 'Mr. Músculo', 'Limpieza', 'Spray para vidrios y espejos, 500 ml.', 2690, 10),
('P008', 'Servilletas de Papel', 'Elite', 'Higiene', '100 servilletas de papel blancas.', 990, 10),
('P009', 'Bolsas de Basura 80L', 'Virutex', 'Aseo', 'Paquete de 10 bolsas resistentes.', 3490, 10),
('P010', 'Guantes de Látex', 'Mapa', 'Protección', 'Guantes reutilizables talla M.', 1990, 10);


-- poblar sucursal
INSERT INTO sucursal (id_sucursal, nombre, direccion) VALUES
(1, 'Sucursal Central', 'Calle Ficticia 123, Santiago'),
(2, 'Sucursal Norte', 'Avenida Norte 456, Santiago'),
(3, 'Sucursal Sur', 'Calle del Sur 789, Santiago'),
(4, 'Sucursal Este', 'Calle Oriente 321, Santiago'),
(5, 'Sucursal Oeste', 'Avenida Oeste 654, Santiago'),
(6, 'Sucursal Centro Comercial', 'Centro Comercial 45, Santiago'),
(7, 'Sucursal Vicuña Mackenna', 'Vicuña Mackenna 5000, Santiago'),
(8, 'Sucursal Providencia', 'Providencia 1234, Santiago'),
(9, 'Sucursal Las Condes', 'Las Condes 2345, Santiago'),
(10, 'Sucursal Maipú', 'Maipú 6789, Santiago');

-- poblar inventario
INSERT INTO Inventario (id_inventario, id_producto, id_sucursal, stock) VALUES
(1, 1, 1, 50),
(2, 2, 1, 30),
(3, 3, 2, 80),
(4, 4, 2, 45),
(5, 5, 3, 60),
(6, 6, 3, 70),
(7, 7, 4, 20),
(8, 8, 5, 90),
(9, 9, 6, 15),
(10, 10, 7, 100);

-- poblar estado_pedido
INSERT INTO estado_pedido (id_estado, nombre) 
VALUES
(1, 'pendiente'),
(2, 'en proceso'),
(3, 'entregado'),
(4, 'cancelado'),
(5, 'retirado'),
(6, 'en espera'),
(7, 'completado');

-- poblar tipo_entrega
INSERT INTO tipo_entrega (id_tipo_entrega, nombre)
VALUES
  (1, 'A domicilio'),
  (2, 'Retiro en tienda'),
  (3, 'Punto de recogida');

-- poblar metodo_pago
INSERT INTO metodo_pago (nombre) VALUES
('Transferencia Bancaria'),
('Webpay'),
('Pago en efectivo');

--Dejar marca como sin marca por defecto
ALTER TABLE Producto
MODIFY marca VARCHAR(255) DEFAULT 'Sin marca';
## 🔐 Paso 3: Configuración de variables de entorno

Crea un archivo `.env` en la raíz del proyecto con la siguiente configuración:

```env
DB_HOST=localhost
DB_USER=administrador
DB_PASSWORD=yR!9uL2@pX
DB_NAME=tienda
PORT=3306
FRONTEND_URL=http://localhost:8081
```

---

## 📁 Paso 4: Estructurar el proyecto

### `index.js`

```js
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use('/login', authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});
```

### `config/db.js`

```js
const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) throw err;
  console.log('✅ Conectado a la base de datos MySQL');
});

module.exports = connection;
```

### `controllers/authController.js`

```js
const db = require('../config/db');

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Falta username o password' });
  }

  const sql = 'SELECT * FROM usuario WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });

    if (results.length > 0) {
      return res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } else {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  });
};
```

### `routes/authRoutes.js`

```js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/', authController.login);

module.exports = router;
```

---

## 🧪 Paso 5: Probar con Postman

1. Inicia el servidor:

```bash
node index.js
```

-- Iniciar servidor Front
npm run serve

2. En Postman, crea una petición:

- **Método:** `POST`
- **URL:** `http://localhost:3306/login`
- **Body (JSON):**
```json
{
  "username": "estudiante",
  "password": "12345"
}
```

3. Si todo está correcto, deberías recibir:

```json
{
  "message": "Inicio de sesión exitoso"
}
```

---

## ✅ Próximos pasos y mejoras

- Usar bcrypt para almacenar contraseñas de forma segura
- Implementar validaciones con Joi
- Agregar tokens JWT para autenticación
- Crear rutas protegidas
- Modularizar aún más el código en servicios

---

## 📌 Licencia

Este proyecto es de uso educativo y libre distribución.
