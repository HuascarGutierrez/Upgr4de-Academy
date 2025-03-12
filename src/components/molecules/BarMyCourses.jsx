import React from 'react'
import "./styles/BarMyCourses.css"
import Buscar from '../atoms/Buscar'

function BarMyCourses() {
  return (
    <>
    <div className = "Cabecera_MyCourses">
        <h2>My Courses</h2>
        <div className ="BarCourses">
            <Buscar/>
            <img src="https://www.bing.com/images/blob?bcid=TrtM.ipEtTMIqxcxoNWLuD9SqbotqVTdP20" alt="" />
            <img src="https://www.bing.com/images/blob?bcid=TiWwCcYqzDMIqxcxoNWLuD9SqbotqVTdP.w" alt="" />
        </div>
    </div>
    
    </>
  )
}

export default BarMyCourses