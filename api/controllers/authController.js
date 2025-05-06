const db = require('../config/db');

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Falta username o password' });
  }

  const sql = 'SELECT * FROM Usuario WHERE correo = ? AND contrasena = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });

    if (results.length > 0) {
      return res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } else {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  });
};

// Método GET para obtener datos del usuario
exports.getUser = (req, res) => {
  const { correo } = req.query;  // Usamos query para recibir el correo del usuario

  if (!correo) {
    return res.status(400).json({ error: 'Falta correo' });
  }

  const sql = 'SELECT * FROM Usuario WHERE correo = ?';
  db.query(sql, [correo], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });

    if (results.length > 0) {
      return res.status(200).json(results[0]);  // Retorna los datos del usuario
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT id_usuario, nombre, correo, contrasena, rut, rol, fecha 
    FROM Usuario 
    WHERE id_usuario = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }

    if (results.length > 0) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
  });
};

exports.actualizarParcialUsuario = async (req, res) => {
  const { id } = req.params;
  const camposActualizados = req.body;

  try {
    const [result] = await db.promise().query('UPDATE Usuario SET ? WHERE id_usuario = ?', [camposActualizados, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario actualizado parcialmente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar parcialmente el usuario', error });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.promise().query('DELETE FROM Usuario WHERE id_usuario = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el usuario', error });
  }
};
