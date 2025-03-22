import React from 'react'
import "./styles/Buscar.css"

function Buscar() {
  return (
    <>
    <div className="buscar">
        <input type="text" placeholder='Buscar'/>
        <img src="/assets/search.svg" alt="" />
    </div>
    </>
  )
}

export default Buscar