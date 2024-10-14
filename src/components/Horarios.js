import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './Horario.css';

const Horarios = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedService, selectedDate, selectedBarber } = location.state || {};
    const [selectedTime, setSelectedTime] = useState("");

    if (!selectedService || !selectedDate || !selectedBarber) {
        return <p>No hay datos disponibles. Por favor, regrese y seleccione un servicio.</p>;
    }

    const handleTime = (e) => {
        setSelectedTime(e.target.value);
    };

    const handleConfirmTurno = () => {
        if (!selectedTime) {
            alert("Por favor, seleccione un horario");
            return;
        }

        const precio = obtenerPrecio(); // Asegúrate de obtener el precio aquí
        // Redirige a la página CrearTurno con la información del turno seleccionada
        navigate('/pagoturno', {
            state: {
                selectedService,
                selectedDate,
                selectedBarber,
                selectedTime,
                precio,
            }
        });
    };

    const tiempodisponible = [
        "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM",
        "2:00 PM", "3:00 PM"
    ];

    const obtenerPrecio = () => {
        switch (selectedService) {
            case "pelo":
                return 6000;
            case "barba":
                return 3000;
            case "ambos":
                return 9000;
            default:
                return 0;
        }
    };

    const precio = obtenerPrecio();

    return (
        <div className="fondo-horario">
        <div className="horarios-container">
            <img src="/SysbarLogo.png" alt="sysbar-logo" className="login-logo" />
            <h3>Datos sobre el turno</h3>
            <p><strong>Servicio:</strong> {selectedService}</p>
            <p><strong>Fecha:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
            <p><strong>Barbero:</strong> {selectedBarber}</p>
            <p><strong>Precio:</strong> {precio}</p>
            <div className="tiempo-selector">
                <h1>Elige tu horario</h1>
                <select value={selectedTime} onChange={handleTime}>
                    <option value="" disabled>--Seleccione un horario--</option>
                    {tiempodisponible.map(time => (
                        <option key={time} value={time}>{time}</option>
                    ))}
                </select>
            </div>

            <button className="btn-pago" onClick={handleConfirmTurno}>
                Realizar pago y confirmar turno
            </button>
        </div>
        </div>
    );
};

export default Horarios;