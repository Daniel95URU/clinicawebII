const express = require('express');
const path = require('path');
const session = require('express-session');
const Db = require('./Db'); // Importamos la clase Db que maneja la conexión a la base de datos
const fs = require('fs'); // Importamos el módulo para trabajar con archivos

const app = express(); // Creamos la aplicación Express
const db = new Db(); // Creamos una instancia de la clase Db para la conexión a la base de datos

app.use(express.json()); // Habilita el middleware para parsear JSON en el request body

app.use(session({ // Configuramos la sesión
  secret: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', // Clave secreta para la sesión
  resave: false, // No volver a guardar la sesión si no se modifica
  saveUninitialized: true, // Guardar la sesión aunque no esté inicializada
  cookie: { // Opciones de la cookie de sesión
    maxAge: 1900000, // Tiempo de vida de la sesión en milisegundos (32 minutos)
    secure: false, // No requiere HTTPS para la cookie (solo para desarrollo)
    sameSite: true, // Establece la política SameSite para la cookie
  },
}));

// Código comentado previamente relacionado a /LoginSignup
// ...

const queries = JSON.parse(fs.readFileSync(path.join(__dirname, 'queries.json'), 'utf8')); // Carga las consultas SQL desde un archivo JSON

// Ruta para cerrar sesión
app.post('/Inicio', (req, res) => {
  req.session.destroy(err => { // Destruye la sesión del usuario
    if (err) {
      return res.status(500).send('Error al cerrar sesión'); // Maneja el error
    }
    res.send({ success: true }); // Envía respuesta exitosa
  });
});

// Ruta para iniciar sesión
app.post('/LoginSignup', async (req, res) => {
  const { username, password } = req.body; // Desestructura el body del request
  try {
    const query = queries.login; // Obtiene la consulta SQL de login del archivo JSON
    const result = await db.execute(query, [username, password]); // Ejecuta la consulta con los parámetros username y password
    console.log(req.session); // Imprime el estado actual de la sesión (solo para debug)

    if (result && result.rows.length > 0) { // Si la consulta retorna un usuario válido
      req.session.userId = result.rows[0].user_id; // Almacena el ID del usuario en la sesión
      return res.json({ success: true }); // Envía respuesta exitosa
    } else {
      return res.status(401).json({ error: 'No existe el usuario' }); // Envía error de usuario no encontrado
    }
  } catch (error) {
    console.error('Error en el login:', error); // Maneja el error
    res.status(500).json({ error: 'Error del servidor' }); // Envía error genérico al cliente
  }
});

app.get('/', (req, res) => {
  // Código para la ruta raíz (/) aún no implementado
});

app.listen(3000, () => {
  console.log(`Servidor escuchando en el puerto 3000`);
});