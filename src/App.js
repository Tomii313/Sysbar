import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Membresia from './components/Membresia/Membresia';
import Register from './components/Register';
import Inicio from "./components/Inicio";
import AgendaTurnos from "./components/AgendaTurnos";
import Catalogo from "./components/Catalogo/Catalogo";
import ProtectedRoute from './components/ProtectedRoute'; // Importa el componente ProtectedRoute
import Horarios from "./components/Horarios";
import PagoTurno from "./components/PagoTurno";
import CrearTurno from "./components/CrearTurno";
import CompraFinal from "./components/Catalogo/compra-final";
import Confirmacion from "./components/Catalogo/confirmacion";
import AdquirirMembresia from "./components/Membresia/AdquirirMembresia";
import { initMercadoPago } from '@mercadopago/sdk-react';  
initMercadoPago('"TEST-6aa306e8-62d9-415e-8c46-6082aaf8d07a"');
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rutas protegidas */}
          <Route
            path="/inicio"
            element={
              <ProtectedRoute>
                <Inicio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agenda-turnos"
            element={
              <ProtectedRoute>
                <AgendaTurnos />
              </ProtectedRoute>
            }
          />
            <Route path="/inicio/Catalogo/catalogo" element={<Catalogo />} />
            <Route
            path="/membresia"
            element={
              <ProtectedRoute>
                <Membresia />
              </ProtectedRoute>
            }
          />
         <Route path="adquirirmembresia" element={<AdquirirMembresia />} />
          <Route path="/horarios" element={<Horarios />} />
          <Route path="/pagoturno" element={<PagoTurno />} />
          <Route path="/crearturno" element={<CrearTurno />} />
          <Route path = "/" exact component = {<Catalogo/>} />
          <Route path ="/compra-final" element={<CompraFinal/>} />
          <Route path ="/confirmacion" element={<Confirmacion/>}/>
      
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
