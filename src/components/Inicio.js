import React, { useEffect } from "react"; // Asegúrate de importar useEffect
import { useNavigate } from "react-router-dom";
import "./Inicio.css";
import axios from "axios";

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

const Inicio = () => {
    const navigate = useNavigate(); // navigate permite cambiar la ruta de la aplicación  
    const token = localStorage.getItem('token'); // Obtiene el token del localStorage

    useEffect(() => {
        if (!token) {
            navigate("/login"); // Redirige si no hay token
        }
    }, [token, navigate]);
    
    return (
        <div className="fondo-inicio">
            <div className="inicio-container">
                <h1 className="textoturno">¡Agendá tu turno!</h1>
                <div className="buttons-container">
                    <button onClick={() => navigate("/agenda-turnos")}>
                        Agendar turno
                    </button>
                    <button onClick={() => navigate("./Catalogo/catalogo")}>
                        Catálogo
                    </button>
                    <button onClick={() => navigate("/membresia")}>
                        Membresía
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Inicio;
