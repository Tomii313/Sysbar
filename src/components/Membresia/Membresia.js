 import React from "react";
 import {useNavigate} from "react-router-dom";
 import "./Membresia.css"
const Membresia=() =>{
const navigate = useNavigate();

const handleAdquirirClick = () => {
    navigate("/adquirirmembresia");
}
return(
<div className = "fondo-membresia">
<h1 className="hola">¡Adquirí tu membresía!</h1>
<div className="info-membresia">
<center><h1>¿Para qué sirve adquirir la membresía Sysbar?</h1></center>
<h2>Adquirir la membresía tiene una gran serie de beneficios para aquellos usuarios habituales o no, en todas las secciones que la barbería ofrece. Turnos, Productos, Sorteos, etc.</h2>
<center><h1>Beneficios</h1></center>
<ul>
<li><h2 className="titulo-beneficios">Descuentos exclusivos en nuestros productos:</h2>
<p className="texto-beneficios">  Accede a precios especiales en todos nuestros productos de cuidado personal. </p></li>
<li><h2 className="titulo-beneficios">Turnos prioritarios:</h2>
<p className="texto-beneficios">  Reservá tus turnos con anticipación y evita esperas</p></li>
<li><h2 className="titulo-beneficios">Sorteos Mensuales</h2>
<p className="texto-beneficios">  Participa en sorteos especiales para miembros y gana productos o servicios gratuitos</p> </li>
<li><h2 className="titulo-beneficios">Acceso a eventos especiales:</h2>
<p className="texto-beneficios">  Obtén consultas de estilo y asesoramiento sin costo adicional.</p>
</li>
<li>
    <h2 className="titulo-beneficios">Regalos de cumpleaños:</h2>
    <p className="texto-beneficios">  Recibe un regalo especial en tu cumpleaños como agradecimiento por ser parte de la familia Sysbar.</p>
</li>
<li>
    <h2 className="titulo-beneficios">Acceso a productos limitados:</h2>
    <p className="texto-beneficios">  Disfruta de la oportunidad de adquirir productos que no están disponibles para el público general.</p>
</li>
<li>
    <h2 className="titulo-beneficios">Programa de referidos:</h2>
    <p className="texto-beneficios">  Invita a amigos y gana beneficios por cada nuevo miembro que se una.</p>
</li>
</ul>
{/*Botón*/}

<button className="boton-membresia" onClick={handleAdquirirClick}>
    Adquirir membresia
    </button>
</div>
    </div>




)


}







 export default Membresia;