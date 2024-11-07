/* eslint-disable no-unused-vars */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Inicio = () => {
  const navigate = useNavigate();

  const handleInicio = async () => {
    try {
      const response = await fetch('/api/inicio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        navigate('/'); // Redirección al login
      } else {
        console.error('No se pudo cerrar la sesión...');
      }
    } catch (error) {
      console.error('Error de conexión al servidor');
    }
  };

  return (
    <div>
      <h1>≡</h1>
      <button onClick={handleInicio}>Cerrar Sesión</button>
    </div>
  );
};

export default Inicio;