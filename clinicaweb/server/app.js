const express = require('express');
const path = require('path');
const session = require('express-session');
const Db = require('./Db');
const fs = require('fs');

const app = express();
const db = new Db();

app.use(express.json());

app.use(session({
  secret: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1900000,
    secure: false,
    sameSite: true,
  },
}));

// app.post("/LoginSignup", async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).send("Invalid data");
//   } else {
//     if (!session.sessionExist(req, res)) {
//       await session.createSession(req, res);
//     } else {
//       res.status(400).send("La sesion ya existe");
//     }
//   }
// });

const queries = JSON.parse(fs.readFileSync(path.join(__dirname, 'queries.json'), 'utf8'));

// Ruta para cerrar sesión
app.post('/Inicio', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.send({ success: true });
  });
});

// Ruta para iniciar sesión
app.post('/LoginSignup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const query = queries.login;
    const result = await db.execute(query, [username, password]);
    console.log(req.session);

    if (result && result.rows.length > 0) {
      req.session.userId = result.rows[0].user_id; 
      return res.json({ success: true });
      
    } else {
      return res.status(401).json({ error: 'No existe el usuario' });
    }
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

app.get('/', (req, res) => {
  
})
app.listen(3000, () => {
  console.log(`Servidor escuchando en el puerto 3000`);
});