import { useState } from "react"; // Importa el hook useState para manejar el estado en el componente
import axios from "axios"; // Importa axios para realizar solicitudes HTTP al servidor
import { useNavigate } from "react-router-dom"; // Importa useNavigate para redireccionar
import "./Login.css"; // Importa el archivo CSS para los estilos
import React from "react";

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

const Login = () => {
  const [email, setEmail] = useState(""); // Estado para almacenar el email del usuario
  const [password, setPassword] = useState(""); // Estado para almacenar la contraseña del usuario
  const [errorMessage, setErrorMessage] = useState(""); // Estado para almacenar el mensaje de error
  const navigate = useNavigate(); // Inicializa useNavigate para la redirección

  // Maneja el inicio de sesión tradicional
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpia el mensaje de error antes de intentar iniciar sesión

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      }); // Envía una solicitud POST con el email y password al servidor.

      localStorage.setItem("token", response.data.access_token); // Guarda el token en localStorage

      // Redirige a la página de inicio (dashboard) tras el login exitoso
      navigate("/inicio"); // Aquí rediriges a la página que contiene los botones
    } catch (error) {
      if (error.response) {
        // Si el servidor devuelve una respuesta
        if (error.response.status === 401) {
          setErrorMessage("Correo o contraseña incorrectos."); // Credenciales incorrectas
        }
      } else {
        setErrorMessage("Ocurrió un error. Intenta nuevamente."); // Otro tipo de error
      }
    }
  };

  // Redirige a la página de registro
  const navigateToRegister = () => {
    navigate("/register"); // Redirige a la página de registro
  };

  return (
    <div className ="fondo-login">
      <div className="login-container">
        <img src="/SysbarLogo.png" alt="Sysbar Logo" className="login-logo" />
        <h1>¡Bienvenido!</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Iniciar Sesión</button>
        </form>

        {/* Muestra el mensaje de error si existe */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <button type="button" onClick={navigateToRegister}>
          Registrarse
        </button>

        {/* Enlaces a WhatsApp */}
        <div className="social-links">
          <a
            href="https://wa.me/3416994676?text=¡Hola!%20Tengo%20algunos%20comentarios%20o%20sugerencias" // Reemplaza con tu número de WhatsApp
            target="hola"
            rel="noopener noreferrer"
          >
            <img src="/whatsappp.png" alt="WhatsApp" className="social-icon" /> {/* Icono de WhatsApp */}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
