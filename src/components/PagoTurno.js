import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Hooks para obtener datos de la URL y navegar entre rutas
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"; // Librerías de Stripe para manejar pagos
import { loadStripe } from "@stripe/stripe-js"; // Cargar la clave pública de Stripe para manejar los pagos
import "./PagoTurno.css"; // Archivo CSS para estilizar el componente
import axios from "axios"; // Cliente HTTP para hacer solicitudes a la API

// Configuramos los encabezados globales para Axios (usa el token CSRF y XMLHttpRequest)
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

// Cargamos la clave de Stripe desde variables de entorno o una clave por defecto
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY || "clave_de_prueba_de_stripe");

const PagoTurno = () => {
    const location = useLocation(); // Hook para obtener el estado pasado a través de la URL
    const navigate = useNavigate(); // Hook para navegar entre rutas
    // Extrae la información sobre el servicio, fecha, barbero, hora y precio de la URL
    const { selectedService, selectedDate, selectedBarber, selectedTime, precio } = location.state || {}; 

    const stripe = useStripe(); // Hook para inicializar Stripe
    const elements = useElements(); // Hook para obtener los elementos de Stripe

    // Estados locales del componente
    const [paymentMethod, setPaymentMethod] = useState("Efectivo"); // Método de pago seleccionado
    const [paymentSuccess, setPaymentSuccess] = useState(false); // Estado para indicar si el pago fue exitoso
    const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error si algo falla en el pago
    const [isSubmitting, setIsSubmitting] = useState(false); // Estado para mostrar que el pago está en proceso

    const handleSubmitPayment = async () => {
        setErrorMessage(""); // Limpiamos los mensajes de error anteriores
        setIsSubmitting(true); // Indicamos que se está procesando el pago

        const token = localStorage.getItem('token'); // Obtenemos el token de autenticación

        try {
            if (paymentMethod === "tarjeta") { // Si se selecciona "tarjeta" como método de pago
                if (!stripe || !elements) { // Verificamos que Stripe esté correctamente cargado
                    throw new Error("Stripe no está cargado. Intenta más tarde.");
                }

                const cardElement = elements.getElement(CardElement); // Obtenemos el elemento de la tarjeta

                if (cardElement._empty) { // Verificamos que los detalles de la tarjeta estén completos
                    throw new Error("Por favor, ingresa los detalles de la tarjeta.");
                }

                // Crea el método de pago con los detalles de la tarjeta
                const { error: paymentMethodError } = await stripe.createPaymentMethod({
                    type: "card",
                    card: cardElement,
                });

                if (paymentMethodError) { // Si hay un error, lo mostramos
                    throw new Error(paymentMethodError.message);
                }

                // Envía una solicitud para crear un "payment intent" en el backend
                const response = await fetch("http://localhost:8000/create-payment-intent", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ amount: precio * 100 }), // El monto debe estar en centavos
                });

                if (!response.ok) { // Si falla la creación del pago
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Error en la creación del pago");
                }

                const { clientSecret } = await response.json(); // Obtiene el "client secret" del servidor
                // Confirma el pago con la tarjeta ingresada
                const result = await stripe.confirmCardPayment(clientSecret);

                if (result.error) { // Si el pago falla
                    throw new Error(result.error.message);
                } else if (result.paymentIntent.status === "succeeded") { // Si el pago es exitoso
                    await saveTurno(); // Guarda el turno en la base de datos
                    setPaymentSuccess(true); // Cambia el estado a "pago exitoso"
                }
            } else { // Si se selecciona "efectivo"
                await saveTurno(); // Guarda el turno sin realizar un pago en línea
                setPaymentSuccess(true);
            }
        } catch (error) { // Captura y muestra los errores
            console.error("Error en el proceso de pago:", error);
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false); // Finaliza el proceso de envío
        }
    };

    // Formatea la fecha seleccionada a formato ISO
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    // Función para guardar el turno en la base de datos
    const saveTurno = async () => {
        try {
            const formattedDate = formatDate(selectedDate); // Formatea la fecha
            const token = localStorage.getItem('token'); // Obtiene el token

            // Envía una solicitud al backend para guardar los detalles del turno
            const response = await fetch("http://localhost:8000/api/turnos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    usuario_id: 1, // Aquí debería usarse el ID real del usuario
                    servicio: selectedService,
                    barbero: selectedBarber,
                    fecha: formattedDate,
                    hora: selectedTime,
                    precio: precio,
                }),
            });

            if (!response.ok) { // Si falla la solicitud
                const errorData = await response.json();
                throw new Error(`Error al guardar el turno: ${errorData.message || response.statusText}`);
            }

            const responseData = await response.json();
            console.log('Turno guardado con éxito:', responseData); // Muestra el turno guardado en consola

        } catch (error) { // Captura y muestra errores al guardar el turno
            console.error('Error al guardar el turno:', error);
            setErrorMessage(error.message);
        }
    };

    // Si no se ha seleccionado un servicio o faltan datos, redirige al usuario
    if (!selectedService || !selectedDate || !selectedBarber || !selectedTime || !precio) {
        navigate("/horarios");
        return <p>Faltan datos sobre el turno. Por favor regrese y seleccione.</p>;
    }

    // Si el pago fue exitoso, muestra un mensaje de éxito y un botón para volver al inicio
    if (paymentSuccess) {
        return (
            <div className="pantalla-exito">
                <h3>Su turno ha sido reservado con éxito</h3>
                <div className="tilde-verde">&#10004;</div>
                <button onClick={() => navigate("/inicio")}>Volver</button> {/*Botón para volver al inicio*/}
            </div>
        );
    }

    // Formulario para seleccionar el método de pago y confirmar el pago
    return (
        <div className="pago-turno">
            <div className="seccion-pago">
                <img src="/SysbarLogo.png" alt="sysbar-logo" className="pago-logo" />
                <h3>Pago</h3>
                <p>Servicio: {selectedService}</p>
                <p>Fecha: {new Date(selectedDate).toLocaleDateString()}</p>
                <p>Hora: {selectedTime}</p>
                <p>Barbero: {selectedBarber}</p>
                <p>Precio: ${precio}</p>

                <label htmlFor="payment-method">Método de Pago</label>
                <select
                    id="payment-method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <option value="Efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                </select>

                {/* Si el método de pago es "tarjeta", muestra el campo de Stripe para ingresar la tarjeta */}
                {paymentMethod === "tarjeta" && (
                    <div className="formulario-tarjeta">
                        <CardElement className="StripeElement" options={{ style: { base: { color: "#fff" } } }} />
                    </div>
                )}

                {/* Si hay un error, lo muestra */}
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                {/* Botón para confirmar el pago, se desactiva si ya se está enviando */}
                <button onClick={handleSubmitPayment} disabled={isSubmitting}>
                    {isSubmitting ? "Procesando..." : "Confirmar Pago"}
                </button>
            </div>
        </div>
    );
};

// Componente que envuelve a PagoTurno con los elementos de Stripe
export default function WrappedPagoTurno() {
    return (
        <Elements stripe={stripePromise}>
            <PagoTurno />
        </Elements>
    );
}
