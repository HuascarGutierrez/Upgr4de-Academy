import React from 'react';
import './styles/Progreso.css';
import Calendario from './Calendario';

function ProgresoCurso() {
  return (
    <div className="ProgresoCurso">
      <div className="ProgresoCurso-contenido">
        <div>
          <h2>Progreso</h2>
          <img src="/images/progreso_image.webp" alt="" />
        </div>
        <Calendario />
      </div>
    </div>
  );
}

export default ProgresoCurso;