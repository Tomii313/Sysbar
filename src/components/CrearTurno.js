import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const CrearTurno = () => {
    const location = useLocation();
    const { selectedService, selectedDate, selectedBarber, selectedTime, precio } = location.state || {};

    // Obtener el ID del usuario desde localStorage
    const [usuarioId, setUsuarioId] = useState(localStorage.getItem('id') || '');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8000/api/agenda', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: usuarioId, // Usar el ID directamente
                servicio: selectedService,
                barbero: selectedBarber,
                fecha: selectedDate,
                hora: selectedTime,
                precio: precio,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Turno guardado:', data);
            // Redirigir a una página de éxito o a otra parte de tu aplicación
            // Puedes usar navigate('/pagina-exito') aquí
        } else {
            console.error('Error al guardar el turno');
        }
    };

    return (
        <div>
            <h2>Confirmar Turno</h2>
            <form onSubmit={handleSubmit}>
                <p>Servicio: {selectedService}</p>
                <p>Fecha: {new Date(selectedDate).toLocaleDateString()}</p>
                <p>Barbero: {selectedBarber}</p>
                <p>Horario: {selectedTime}</p>
                <p>Precio: {precio}</p>

                {/* Este campo es opcional si obtienes el usuarioId automáticamente */}
                <input
                    type="number"
                    placeholder="ID Usuario"
                    value={usuarioId}
                    onChange={(e) => setUsuarioId(e.target.value)} // Permite al usuario cambiar el ID manualmente (si es necesario)
                    required
                />
                <button type="submit">Confirmar Turno</button>
            </form>
        </div>
    );
};

export default CrearTurno;

