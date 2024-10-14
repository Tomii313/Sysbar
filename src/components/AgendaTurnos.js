import React, { useState } from "react"; // Importa useState
import { useNavigate } from "react-router-dom"; 
import Calendar from "react-calendar"; // Importa el componente del calendario
import "./AgendaTurnos.css"
import "react-calendar/dist/Calendar.css" // Importa los estilos del calendario

const AgendaTurnos = () => {
  const [selectedService, setSelectedService] = useState(""); // Guarda el servicio seleccionado
  const [selectedDate, setSelectedDate] = useState(new Date()); // Guarda la fecha seleccionada
  const navigate = useNavigate();
  const [selectedBarber, setSelectedBarber] = useState(""); // Estado para el barbero seleccionado

  // Maneja el cambio del servicio seleccionado
  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
  };

  // Maneja el cambio de la fecha seleccionada
  const handleDateChange = (date) => {
    setSelectedDate(date);
  }

  // Maneja el cambio de barbero seleccionado
  const handleBarberChange = (e) => {
    setSelectedBarber(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedService || !selectedBarber || !selectedDate) {
      alert("Por favor, rellene todos los campos");
    } else {
      navigate("/horarios", { // Cambiado a /horarios
        state: { selectedService, selectedDate, selectedBarber }
      });
    }
  }

  // Fechas ocupadas (deshabilitadas en el calendario)
  const disabledDates = [
    new Date(2024, 8, 20), // Ejemplo fecha ocupada 20 de septiembre de 2024
    new Date(2024, 8, 22)
  ];

  // Función para deshabilitar fechas ocupadas
  const isDateDisabled = (date) => {
    const dayOfWeek = date.getDay(); // 0 es domingo, 1 es lunes
    const isSundayOrMonday = dayOfWeek === 0 || dayOfWeek === 1; // Si es domingo o lunes
    const isOccupied = disabledDates.some( // Verifica si la fecha es un domingo, un lunes o está ocupada en disabledDates 
      (disabledDate) => disabledDate.getTime() === date.getTime()
    )
    return isSundayOrMonday || isOccupied;
  };
    
  return (
    <div className = "fondo-turno">
    <div className="turnos-container">
      <img src="/SysbarLogo.png" alt="Sysbar Logo" className="login-logo"></img>
      <h1>Agendar Turno</h1>
      {/* Selección de servicio */}
      <div className="dropdown-container">
        
        <select value={selectedService} onChange={handleServiceChange} className="dropdown">
          <option value="" disabled>-- Seleccione un servicio --</option>
          <option value="barba">Barba</option>
          <option value="pelo">Pelo</option>
          <option value="ambos">Ambos</option>
        </select>
      </div>

      {/* Mostrar el calendario */}
      <h2>Seleccione la fecha</h2>
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange} // Maneja la selección de fecha
          value={selectedDate} // Fecha seleccionada actualmente
          tileDisabled={({ date }) => isDateDisabled(date)} // Deshabilitar fechas ocupadas
          locale="es-ES" // Para establecer el idioma español
          formatShortWeekday={(locale, date) => date.toLocaleDateString('es-ES', { weekday: 'short' })} // Días 
        />
      </div>

      {/* Mostrar fecha seleccionada */}
      {selectedDate && (
        <p>Fecha seleccionada: {selectedDate.toDateString()}</p> // Muestra la fecha seleccionada
      )}

      {/* Botón de selección de barbero */}
      <div className="dropdown-container">
        <select value={selectedBarber} onChange={handleBarberChange} className="dropdown">
          <option value="" disabled>--Seleccione un barbero--</option>
          <option value="Tito Calderón">Tito Calderón</option>
          <option value="Juan Bulacios">Juan Bulacios</option>
          <option value="Miguel Bonaventura">Miguel Bonaventura</option>
        </select>
      </div>

      <div className="buttons-container">
        <button className="btn-agenda" onClick={handleSubmit}>
          Enviar
        </button>
      </div>
    </div>
    </div>
  );
};

export default AgendaTurnos;
