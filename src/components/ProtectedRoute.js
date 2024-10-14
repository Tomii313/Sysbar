import React from 'react';  
import { Navigate } from 'react-router-dom';  

const ProtectedRoute = ({ children }) => {  
    const token = localStorage.getItem("token"); // Obtén el token del almacenamiento local  

    // Si no hay token, redirige al login. De lo contrario, renderiza el componente hijo.  
    return token ? children : <Navigate to="/login" />;  
};  

export default ProtectedRoute;  