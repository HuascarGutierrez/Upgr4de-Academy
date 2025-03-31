import React from 'react'
import "./styles/BarMyCourses.css"
import Buscar from '../atoms/Buscar'

function BarMyCourses() {
  return (
    <>
    <div className = "Cabecera_MyCourses">
        <h2></h2>
        <div className ="BarCourses">
            <Buscar/>
            <img src="/assets/settings.svg" alt="" />
            <img src="/assets/Icons-drawer.svg" alt="" />
        </div>
    </div>
    
    </>
  )
}

export default BarMyCourses