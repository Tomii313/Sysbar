import { useState } from "react"; // Importa el hook useState
import axios from "axios"; // Importa axios para solicitudes HTTP
import "./Register.css"; // Importa el archivo CSS con la ruta correcta

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Configuración del CSRF token para solicitudes protegidas
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

const Register = () => {
  const [email, setEmail] = useState(""); // Estado para el correo electrónico
  const [username, setUsername] = useState(""); // Estado para el nombre de usuario
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [passwordConfirmation, setPasswordConfirmation] = useState(""); // Estado para la confirmación de la contraseña
  const [errors, setErrors] = useState({}); // Estado para los errores
  const [success, setSuccess] = useState(""); // Estado para el mensaje de éxito

  // Función para manejar el envío del formulario
  const handleRegister = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recarga de página)
    
    // Validación simple para los campos vacíos
    if (!email || !username || !password || !passwordConfirmation) {
      setErrors({ general: "Por favor, complete todos los campos." });
      return; // Detener la ejecución si hay campos vacíos
    }

    try {
      // Envía una solicitud POST al servidor con los datos del formulario
      const response = await axios.post("http://localhost:8000/api/register", {
        email,
        name: username, // Cambia 'username' a 'name' para que coincida con lo que espera Laravel
        password,
        password_confirmation: passwordConfirmation, // Laravel espera este campo para confirmar la contraseña
      });

      console.log("¡Registro exitoso!", response.data);
      setSuccess("¡Registro exitoso!"); // Mensaje de éxito
      setErrors({}); // Limpia cualquier mensaje de error

      // Redirigir o hacer algo tras el registro exitoso
      // Por ejemplo, redirigir a la página de inicio de sesión
      // window.location.href = "/login"; // Si quieres redirigir automáticamente

    } catch (error) {
      // Manejo de errores del servidor
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors); // Actualiza el estado con los errores específicos del servidor
      } else {
        setErrors({ general: "Hubo un problema con el registro. Inténtalo de nuevo." }); // Mensaje de error general
      }
      setSuccess(""); // Limpia el mensaje de éxito en caso de error
    }
  };

  return (
    <div className="fondo-register">
    <div className="register-container">
      <img src="/SysbarLogo.png" alt="Sysbar Logo" className="login-logo" />
      <h3>¡Creá tu cuenta!</h3>
      <form className="register-form" onSubmit={handleRegister}>
        {/* Formulario de registro */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nombre de usuario"
        />
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
          placeholder="Contraseña"
        />
        <input
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          placeholder="Confirmar Contraseña"
        />
        <button type="submit">Registrarse</button>
      </form>

      {/* Muestra los mensajes de error si existen */}
      {errors.general && <p className="error-message">{errors.general}</p>}
      {errors.email && <p className="error-message">{errors.email[0]}</p>}
      {errors.name && <p className="error-message">{errors.name[0]}</p>}
      {errors.password && <p className="error-message">{errors.password[0]}</p>}
      {errors.password_confirmation && <p className="error-message">{errors.password_confirmation[0]}</p>}

      {/* Muestra el mensaje de éxito si existe */}
      {success && <p className="success-message">{success}</p>}
    </div>
    </div>
  );
};

export default Register;
