import React from 'react'
import "./styles/Progreso.css"
import Calendario from './Calendario'

function ProgresoCurso() {
  return (
    <>
    <div className='ProgresoCurso'>
        <div>
            <h2>Progreso</h2>
            <img src="/images/progreso_image.webp" alt="" />
        </div>
        <Calendario/>
    </div>
    </>
  )
}

export default ProgresoCurso