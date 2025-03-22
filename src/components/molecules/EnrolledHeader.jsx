import React from 'react'
import "./styles/EnrolledH.css"

function EnrolledHeader() {
  return (
    <>
    <div className='EnrolledHeader'>
        <h2>Cusos Inscritos</h2>
        <div className='Boton_vercatalogo'>
            <img src="/Icons/zowl-white.svg" alt="" />
            <p>Catalogo de cursos</p>
        </div>
    </div>
    </>
  )
}

export default EnrolledHeader