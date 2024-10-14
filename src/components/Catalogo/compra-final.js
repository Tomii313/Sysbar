import React, { useState } from "react";  
import { useNavigate, useLocation } from "react-router-dom";  
import axios from "axios";  
import "./compra-final.css";  
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';  

// Inicializa Mercado Pago con la clave pública  
initMercadoPago('TEST-6aa306e8-62d9-415e-8c46-6082aaf8d07a'); // Reemplaza con tu clave pública  

const CheckoutForm = ({ totalAmount, onPaymentSuccess }) => {  
  const [isProcessing, setIsProcessing] = useState(false);  
  const [errorMessage, setErrorMessage] = useState("");  

  const handlePayment = async () => {
    setIsProcessing(true);
    setErrorMessage("");
    const token = localStorage.getItem('token');
    try {
      // Aquí llamamos a la API de Laravel para crear la preferencia
      const response = await axios.post("http://localhost:8000/api/create-preference", {
        totalAmount: totalAmount, // Pasamos el monto total
        
      });
  
      if (response.data && response.data.init_point) {
        window.location.href = response.data.init_point; // Redirige a Mercado Pago
      } else {
        setErrorMessage("Error en la creación de la preferencia de pago.");
      }
    } catch (error) {
      console.error("Error en el pago:", error);
      setErrorMessage("Hubo un error al procesar el pago.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (  
    <div>  
      <h3>Total a pagar: ${totalAmount.toFixed(2)}</h3>  
      {errorMessage && <p className="error-message">{errorMessage}</p>}  
      <button onClick={handlePayment} className="submit-btn" disabled={isProcessing}>  
        {isProcessing ? "Procesando..." : "Pagar ahora"}  
      </button>  
    </div>  
  );  
};  

const CompraFinal = () => {  
  const [formData, setFormData] = useState({  
    name: "",  
    address: "",  
    city: "",  
    deliveryTipe: "retirar",  
  });  

  const [envio, setEnvio] = useState(0);  
  const navigate = useNavigate();  
  const location = useLocation();  
  const { cartItems, totalPrice } = location.state || { cartItems: [], totalPrice: 0 };  

  const handleChange = (e) => {  
    const { name, value } = e.target;  
    setFormData({ ...formData, [name]: value });  

    if (name === "deliveryTipe") {  
      setEnvio(value === "envio" ? 1000 : 0); // Añade el costo de envío si se elige "envio"  
    }  
  };  

  const totalConEnvio = (Number(totalPrice) || 0) + (Number(envio) || 0);  

  const handlePaymentSuccess = async () => {  
    const token = localStorage.getItem('token');  

    if (!token) {  
      console.error("Token de autenticación no encontrado.");  
      return;  
    }  

    try {  
      await axios.post("http://localhost:8000/api/ventas", {  
        name: formData.name,  
        address: formData.address,  
        city: formData.city,  
        deliveryType: formData.deliveryTipe,  
        productPurchased: cartItems.map(item => item.productName).join(', '),  
      }, {  
        headers: {  
          'Authorization': `Bearer ${token}`, // Incluye el token en los headers  
          'Content-Type': 'application/json',  
        },  
      });  

      navigate("/confirmacion", { replace: true });  
    } catch (error) {  
      console.error("Error al registrar la venta:", error);  
    }  
  };  

  return (  
    <div className="fondo-compra">  
      <div className="form-container">  
        <h2>Finalizar compra</h2>  
        {cartItems.length === 0 ? (  
          <p>No hay artículos en el carrito</p>  
        ) : (  
          <div className="cart-summary">  
            <h4>Total: ${totalConEnvio.toFixed(2)}</h4>  
          </div>  
        )}  

        <div className="form-group">  
          <label htmlFor="name">Nombre completo</label>  
          <input  
            type="text"  
            id="name"  
            name="name"  
            placeholder="Nombre y Apellido"  
            onChange={handleChange}  
            required  
          />  
        </div>  
        <div className="form-group">  
          <label htmlFor="address">Dirección</label>  
          <input  
            type="text"  
            id="address"  
            name="address"  
            placeholder="Dirección"  
            onChange={handleChange}  
            required  
          />  
        </div>  
        <div className="form-group">  
          <label htmlFor="city">Ciudad</label>  
          <input  
            type="text"  
            id="city"  
            name="city"  
            placeholder="Ciudad"  
            onChange={handleChange}  
            required  
          />  
        </div>  
        <div className="form-group">  
          <label htmlFor="deliveryType">Método de entrega</label>  
          <select  
            id="deliveryType"  
            name="deliveryTipe"  
            onChange={handleChange}  
            value={formData.deliveryTipe}  
            required  
          >  
            <option value="retirar">Retirar en el local</option>  
            <option value="envio">Envío a domicilio (+ Costo)</option>  
          </select>  
        </div>  

        <CheckoutForm  
          totalAmount={totalConEnvio}  
          onPaymentSuccess={handlePaymentSuccess}   
        />  
  
        <div className="textoseguimiento-container">  
          <h4>  
            Al finalizar la compra, se hará un seguimiento de esta vía Whatsapp y por Correo Electrónico.
            </h4>  
          </div>  
        </div>  
      </div>  
    );  
  };  
  
  export default CompraFinal;  