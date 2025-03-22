import React from 'react'
import "./styles/Progreso.css"

function Progreso() {
  return (
    <>
<div className="CursoProgreso">
    <div className="icono">
        <img src="/Icons/Materia1.svg" alt="book"/>
    </div>

    <div className="content">
        <div className="titulo">Calculo</div>
        <div className="progress-text">Progreso</div>
        <div className="progress-bar-container">
            <div className="progress-bar"></div>
        </div>
    </div>

    <div className="progress-indicators">
        <div className="indicator">
            <img src="/Icons/menu_book.svg" alt="book"/>
            2/10
        </div>
        <div className="indicator">
            <img src="/Icons/contract_edit.svg" alt="note"/>
            3/5
        </div>
    </div>
    <div className="menu">
        <img src="/Icons/more_horizontal.svg" alt="" />
    </div>
</div>
    </>
  )
}

export default Progreso