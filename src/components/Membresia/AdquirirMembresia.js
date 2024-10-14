import React from "react";
import "./AdquirirMembresia.css";
import axios from "axios"; // Para hacer las peticiones al backend

const AdquirirMembresia = () => {

    const handleMembresiaClick = async (price, title) => {
        try {
            // Llamamos al backend para crear la preferencia de Mercado Pago
            const response = await axios.post('http://localhost:8000/create-preference', { price, title });
            
            // Verifica si la respuesta tiene un id
            if (response.data.id) {
                // Redirigimos al usuario a Mercado Pago
                window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${response.data.id}`;
            } else {
                console.error('No se recibió un ID de preferencia');
            }
        } catch (error) {
            console.error('Error al crear la preferencia', error);
            alert('Ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo.');
        }
    };

    return (
        <div className="fondinho">
            <div className="adquirirmembresia">
                <img src ="./SysbarLogo.png" alt="Sysbar Logo" className="login-logo" />
                <h1 className="costopagos">Precios</h1>
                <div className="precios-membresia">
                    <div 
                        className="membresia-tarjeta"
                        onClick={() => handleMembresiaClick(7500, "Membresía 6 meses")}
                    >
                        <h3>Membresía 6 meses</h3>
                        <p className="precio">$7.500</p>
                    </div>
                    <div 
                        className="membresia-tarjeta"
                        onClick={() => handleMembresiaClick(5000, "Membresía 3 meses")}
                    >
                        <h3>Membresía 3 meses</h3>
                        <p className="precio">$5.000</p>
                    </div>
                    <div 
                        className="membresia-tarjeta"
                        onClick={() => handleMembresiaClick(3000, "Membresía 1 mes")}
                    >
                        <h3>Membresía 1 mes</h3>
                        <p className="precio">$3.000</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdquirirMembresia;
