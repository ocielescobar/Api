const db = require('../config/db');

// Obtener productos
const obtenerProductos = (callback) => {
  const sql = 'SELECT * FROM Producto';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Obtener producto por id
const obtenerProductoPorId = (id, callback) => {
  const sql = 'SELECT * FROM Producto WHERE id_producto = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Agregar producto (incluye stock)
const agregarProducto = (producto, callback) => {
  const { codigo_producto, nombre, marca, categoria, descripcion, precio, stock } = producto;
  const sql = 'INSERT INTO Producto (codigo_producto, nombre, marca, categoria, descripcion, precio, stock) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [codigo_producto, nombre, marca, categoria, descripcion, precio, stock], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta de inserción:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Eliminar producto por id
const eliminarProducto = (id, callback) => {
  const sql = 'DELETE FROM Producto WHERE id_producto = ?';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta de eliminación:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

// Actualizar producto por id (ahora también incluye stock)
const actualizarProducto = (id, producto, callback) => {
  const { codigo_producto, nombre, marca, categoria, descripcion, precio, stock } = producto;

  let updateFields = [];
  let values = [];

  if (codigo_producto) {
    updateFields.push('codigo_producto = ?');
    values.push(codigo_producto);
  }
  if (nombre) {
    updateFields.push('nombre = ?');
    values.push(nombre);
  }
  if (marca) {
    updateFields.push('marca = ?');
    values.push(marca);
  }
  if (categoria) {
    updateFields.push('categoria = ?');
    values.push(categoria);
  }
  if (descripcion) {
    updateFields.push('descripcion = ?');
    values.push(descripcion);
  }
  if (precio) {
    updateFields.push('precio = ?');
    values.push(precio);
  }
  if (stock != null) {
    updateFields.push('stock = ?');
    values.push(stock);
  }

  values.push(id);

  const sql = `UPDATE Producto SET ${updateFields.join(', ')} WHERE id_producto = ?`;
  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta de actualización:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  agregarProducto,
  eliminarProducto,
  actualizarProducto
};
