const expressSession = require('express-session');
const PgSession = require('connect-pg-simple')(expressSession);

class Session {
  constructor(app, db) {
    this.db = db;
    this.setupSession(app);
  }

  setupSession(app) {
    app.use(
      expressSession({
        store: new PgSession({
          pool: this.db.pool,
          tableName: 'session',
        }),
        secret: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 1900000,
          secure: false,
          sameSite: true,
        },
      })
    );
  }

  sessionExists(req) {
    return req.session && req.session.userId ? true : false;
    
  }

  async createSession(req, res) {
    const { username, password } = req.body;
    try {
      const query = `
        SELECT u.user_id, u.username, p.profile_id 
        FROM user u
        INNER JOIN profile p ON p.profile_id = u.profile_id 
        WHERE u.username = $1 AND u.password = $2
      `;
      const result = await this.db.execute(query, [username, password]);
      if (result.rows.length > 0) {
        req.session.userId = result.rows[0].user_id;
        req.session.userName = result.rows[0].username;
        req.session.userProfile = result.rows[0].profile_id;
        res.send('Sesión creada con éxito.');
        
      } else {
        res.status(401).send('401: No se puede iniciar sesión');
      }
    } catch (error) {
      console.error('Error al crear la sesión', error);
      res.status(500).send('500: Error del servidor');
    }
  }
}

module.exports = Session;


