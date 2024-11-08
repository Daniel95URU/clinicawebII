const expressSession = require('express-session'); // Importa el módulo de sesiones de Express
const PgSession = require('connect-pg-simple')(expressSession); // Importa el módulo para almacenar sesiones en PostgreSQL

class Session {
  constructor(app, db) {
    this.db = db; // Almacena la instancia de la base de datos
    this.setupSession(app); // Configura la sesión en la aplicación Express
  }

  setupSession(app) {
    app.use(
      expressSession({
        store: new PgSession({
          pool: this.db.pool, // Utiliza el pool de conexiones de la base de datos
          tableName: 'session', // Nombre de la tabla para almacenar las sesiones
        }),
        secret: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', // Clave secreta para firmar la sesión
        resave: false, // No guarda la sesión si no ha cambiado
        saveUninitialized: true, // Guarda la sesión incluso si está vacía
        cookie: {
          maxAge: 1900000, // Tiempo de vida de la sesión en milisegundos
          secure: false, // No requiere HTTPS para la cookie
          sameSite: true, // Política de SameSite para la cookie
        },
      })
    );
  }

  sessionExists(req) {
    return req.session && req.session.userId ? true : false; // Verifica si existe una sesión válida
  }

  async createSession(req, res) {
    const { username, password } = req.body; // Obtiene el nombre de usuario y contraseña del cuerpo de la solicitud

    try {
      const query = `
        SELECT u.user_id, u.username, p.profile_id 
        FROM user u
        INNER JOIN profile p ON p.profile_id = u.profile_id 
        WHERE u.username = $1 AND u.password = $2
      `; // Consulta SQL para obtener información del usuario

      const result = await this.db.execute(query, [username, password]); // Ejecuta la consulta con los parámetros

      if (result.rows.length > 0) { // Si se encuentra un usuario válido
        req.session.userId = result.rows[0].user_id; // Almacena el ID del usuario en la sesión
        req.session.userName = result.rows[0].username; // Almacena el nombre de usuario en la sesión
        req.session.userProfile = result.rows[0].profile_id; // Almacena el perfil del usuario en la sesión
        res.send('Sesión creada con éxito.');
      } else {
        res.status(401).send('401: No se puede iniciar sesión'); // Envía un error 401 si las credenciales son incorrectas
      }
    } catch (error) {
      console.error('Error al crear la sesión', error);
      res.status(500).send('500: Error del servidor');
    }
  }
}

module.exports = Session;