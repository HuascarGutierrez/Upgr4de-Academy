import React from 'react'
import "./styles/Progreso.css"

function Progreso() {
  return (
    <>
<div className="CursoProgreso">
    <div className="icono">
        <img src="/Icons/Materia1.svg" alt="book"/>
    </div>

    <div className="contenido">
        <div className="titulo">Calculo</div>
        <div className="ProgresoText">Progreso</div>
        <div className="ContenedorProgreso">
            <div className="ProgresoBarra"></div>
        </div>
    </div>

    <div className="ProgresoIndicadores">
        <div className="indicador">
            <img src="/Icons/menu_book.svg" alt="book"/>
            2/10
        </div>
        <div className="indicador">
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