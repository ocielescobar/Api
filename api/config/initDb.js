const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
});

//Base de datos

const sql = `

CREATE DATABASE IF NOT EXISTS tienda_db;
USE tienda_db;

CREATE TABLE IF NOT EXISTS metodo_pago (
  id_metodo_pago INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Estado_Pedido (
    id_estado INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Tipo_Entrega (
    id_tipo_entrega INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Sucursal (
    id_sucursal INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    direccion TEXT
);

CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    correo VARCHAR(100) UNIQUE,
    contrasena VARCHAR(100),
    rut VARCHAR(20),
    rol VARCHAR(100),
    fecha DATE
);

CREATE TABLE IF NOT EXISTS Suscripcion (
    id_suscripcion INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    correo VARCHAR(100),
    fecha_suscripcion DATE,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS Contacto (
    id_contacto INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT,
    mensaje TEXT,
    fecha DATE,
    FOREIGN KEY (id_cliente) REFERENCES Usuario(id_usuario)
);

CREATE TABLE IF NOT EXISTS Producto (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    codigo_producto VARCHAR(50) NULL,
    nombre VARCHAR(100),
    marca VARCHAR(50) NULL,
    categoria VARCHAR(50) NULL,
    descripcion TEXT NULL,
    precio DECIMAL(10,2),
    stock INT,
    imagen VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Inventario (
    id_inventario INT PRIMARY KEY AUTO_INCREMENT,
    id_producto INT,
    id_sucursal INT,
    stock INT,
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto),
    FOREIGN KEY (id_sucursal) REFERENCES Sucursal(id_sucursal)
);

CREATE TABLE IF NOT EXISTS Pedido (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT,
    fecha_pedido DATE,
    estado_pedido INT,
    tipo_entrega INT,
    direccion_entrega TEXT,
    metodo_pago INT,
    total DECIMAL(10,2),
    FOREIGN KEY (id_cliente) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (estado_pedido) REFERENCES Estado_Pedido(id_estado),
    FOREIGN KEY (tipo_entrega) REFERENCES Tipo_Entrega(id_tipo_entrega),
    FOREIGN KEY (metodo_pago) REFERENCES Metodo_Pago(id_metodo_pago)
);

CREATE TABLE IF NOT EXISTS Detalle_pedido (
    id_detalle_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT,
    id_producto INT,
    cantidad INT,
    precio_unitario DECIMAL(10,2),
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

CREATE TABLE IF NOT EXISTS Pago (
    id_pago INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT,
    fecha_pago DATE,
    metodo_pago INT,
    estado VARCHAR(50),
    monto DECIMAL(10,2),
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido),
    FOREIGN KEY (metodo_pago) REFERENCES Metodo_Pago(id_metodo_pago)
);

CREATE TABLE IF NOT EXISTS Carrito (
    id_carrito INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT,
    id_producto INT,
    cantidad INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);
CREATE TABLE IF NOT EXISTS BoletaProducto (
    id_boleta INT,
    id_producto INT,
    cantidad INT,
    precio_unitario DECIMAL(10,2),
    FOREIGN KEY (id_boleta) REFERENCES Boleta(id_boleta),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);
CREATE TABLE IF NOT EXISTS transacciones_webpay (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  id_pedido INT NOT NULL,
  autorizacion_code VARCHAR(20),
  response_code INT,
  amount INT,
  card_number VARCHAR(20),
  status VARCHAR(50),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido)
);
`;

connection.connect((err) => {
  if (err) {
    console.error('❌ Error de conexión a MySQL:', err.message);
    return;
  }
  console.log('✅ Conectado a MySQL para inicializar');

  connection.query(sql, (err) => {
    if (err) console.error('❌ Error ejecutando script:', err.message);
    else console.log('✅ Base de datos y tablas creadas correctamente');
    connection.end();
  });
});
