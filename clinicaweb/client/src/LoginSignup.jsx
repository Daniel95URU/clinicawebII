
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import style from "./LoginSignup.module.css";
import user_icon from "./assets/person.png";
import email_icon from "./assets/email.png";
import password_icon from "./assets/password.png";
import logo from "./assets/completeLogo.png";
import background from "./assets/fondo.png";

const LoginSignup = ({ onLogin }) => {
   const [action, setAction] = useState("Login");
  const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [passwordRecoveryEmail, setPasswordRecoveryEmail] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Eliminar la marca del error anterior

    try {
      const response = await fetch('/api/LoginSignup', { // Usar la ruta /api
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          navigate('/Inicio'); 
        }
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error de conexión');
     }
   };

  return (
    <div
      className={style["background-container"]}
      style={{ backgroundImage: `url(${background})` }} //fondo
    >
      <div className={style["inner-container"]}>
        <div className={style.container}>
          <div className={style.header}>
            <img src={logo} alt="Logo" className={style.logo} />
            <h2 className={style.text}>{action}</h2>
            <div className={style.underline}></div>
          </div>
          {message && <div className={style.message}>{message}</div>}
          <form onSubmit={handleSubmit}>
            {action === "Signup" && (
              <div className={style.inputs}>
                <div className={style.inputAnima}>
                  <div className={style.input}>
                    <img src={user_icon} alt="user" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <label>Username</label>
                  </div>
                </div>
              </div>
            )}
            <div className={style.inputs}>
              <div className={style.inputAnima}>
                <div className={style.input}>
                  <img src={email_icon} alt="email" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <label>Email</label>
                </div>
                {emailError && <div className={style.error}>{emailError}</div>}
              </div>
            </div>
            <div className={style.inputs}>
              <div className={style.inputAnima}>
                <div className={style.input}>
                  <img src={password_icon} alt="password" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label>Password</label>
                </div>
                {passwordError && (
                  <div className={style.error}>{passwordError}</div>
                )}
              </div>
            </div>
            {action === "Login" && (
              <div className={style.forgotPassword}>
                <span
                  onClick={() =>
                    setAction((prev) =>
                      prev === "Login" ? "RecoverPassword" : "Login"
                    )
                  }
                >
                  Olvido la contrasena?
                </span>
              </div>
            )}
            {action === "RecoverPassword" && (
              <div className={style.inputs}>
                <div className={style.inputAnima}>
                  <div className={style.input}>
                    <img src={email_icon} alt="email" />
                    <input
                      type="email"
                      value={passwordRecoveryEmail}
                      onChange={(e) => setPasswordRecoveryEmail(e.target.value)}
                      required
                    />
                    <label>Email para recuperar la contraseña</label>
                  </div>
                </div>
                <div className={style.forgotPassword}>
                  <span
                    onClick={() => setAction("Login")}
                  >
                    Volver al login
                  </span>
                </div>
              </div>
            )}
            <button type="submit" className={style.submit}>
              {action}
            </button>
          </form>
          <div className={style.switchContainer}>
            <div className={style.switchText}>
              {action === "Login"
                ? "No tienes cuenta? "
                : "Ya tienes una cuenta? "}
              <span
                className={style.switchLink}
                onClick={() =>
                  setAction((prev) => (prev === "Login" ? "Signup" : "Login"))
                }
              >
                {action === "Login" ? "Sign Up" : "Log In"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;



