import React from 'react'
import "./styles/BarMyCourses.css"
import Buscar from '../atoms/Buscar'
import { useNavigate } from 'react-router-dom';

function BarMyCourses() {
  const navigate = useNavigate();
  return (
    <>
    <div className = "Cabecera_MyCourses">
        <h2>Mis Cursos</h2>
        <div className ="BarCourses">
            <Buscar/>
            <div onClick={() => {
              navigate("/main/perfil");
            }}>
              <img src="/assets/settings.svg" alt="" />
            </div>
            
            <img src="/assets/Icons-drawer.svg" alt="" />
        </div>
    </div>
    
    </>
  )
}

export default BarMyCourses