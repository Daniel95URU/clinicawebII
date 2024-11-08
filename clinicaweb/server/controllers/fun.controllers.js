const pool = require("../Db");
const { Resend } = require("resend");
const crypto = require("crypto");
const { userQuery, updateQuery, checkEmailQuery, insertPersonQuery, insertUserProfileQuery, insertUserQuery,
  personQuery
 } = require('../query');
const { loadPermissionsForUser } = require("./permission.controllers");

const resend = new Resend("re_4CVKeLqM_MJ1D3GhHhVdXnvqAGxxV1ktx");

const createLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(userQuery, [email, password]);
    console.log(result)
    
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      
      if (user.password === password) {
        req.session.isLoggedIn = true;
        req.session.username = email;
        req.session.password = password;
        const sessionId = req.session.id;
        const personId = user.persona_id;
        const profileUser = user.profile_id
        
        console.log(`SessionID:  ${sessionId}`);
        
        // Load permissions and set them in the session
        const permissions = await loadPermissionsForUser(user.persona_id);
        req.session.permissions = permissions;

        res.status(200).json({ success: true, message: "Login successful", permissions, personId, profileUser });
        return;
      }
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.status(401).json({ success: false, message: "User or password are incorrect" });
    });
  } catch (err) {
    console.error("Error querying user data:", err);
    res.status(500).json({ success: false, message: "Error querying user data" });
  }
}

const recoverPassword = async (req, res) => {
  const email = req.body.email;
  console.log(`Received request to send recovery email for correo: ${email}`);

  try {
    const checkEmailResult = await pool.query(checkEmailQuery, [email]);

    if (checkEmailResult.rows.length === 0) {
      return res.status(404).send("No se encontró una cuenta con ese correo electrónico");
    }

    const { persona_id } = checkEmailResult.rows[0];
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await pool.query(updateQuery, [token, expires, persona_id]);

    const data = await resend.emails.send({
      from: "PAD <padrecorver@resend.dev>",
      to: [email],
      subject: "Recover your password",
      html: `Your password reset token is: ${token}`,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(400).json({ error: error.message });
  }
}

const createSignup = async (req, res) => {
  const { nombre, tlf_per, email, des_per, password } = req.body;
  console.log(`Received request to signup: ${email}`);

  try {
    // Verificar si el correo ya está registrado
    const checkEmailResult = await pool.query(checkEmailQuery, [email]);

    if (checkEmailResult.rows.length > 0) {
      return res.status(400).send("You already signed up");
    }

    // Insertar la nueva persona
    const insertPersonResult = await pool.query(insertPersonQuery, [nombre, tlf_per, email, des_per]);
    const newPersonId = insertPersonResult.rows[0].persona_id;

    // Insertar el nuevo usuario
    const insertUserResult = await pool.query(insertUserQuery, [newPersonId, password]);
    const newUserId = insertUserResult.rows[0].id_usu;

    // Asociar el nuevo usuario con el perfil de usuario
    const userProfileId = 4; // Suponiendo que el perfil de usuario tiene el id 4
    await pool.query(insertUserProfileQuery, [newUserId, userProfileId]);

    res.status(201).send("User successfully signed up");
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  createLogin,
  recoverPassword,
  createSignup
};
