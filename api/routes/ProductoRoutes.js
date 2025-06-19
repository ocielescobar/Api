const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productoController = require('../controllers/ProductoController');

// Configuración de almacenamiento para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Obtener extensión (.jpg, .png)
    const nombreArchivo = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, nombreArchivo); // Nombre del archivo final
  }
});

const upload = multer({ storage });

// Rutas de productos
router.patch('/productos/stock', productoController.actualizarStock);
router.get('/productos', productoController.obtenerProductos);
router.get('/productos/:id', productoController.obtenerProductoPorId);

// Aquí se permite subir 1 imagen usando multer
router.post('/productos', upload.single('imagen'), productoController.agregarProducto);

router.delete('/productos/:id', productoController.eliminarProducto);
router.patch('/productos/:id', productoController.actualizarProducto);

module.exports = router;
